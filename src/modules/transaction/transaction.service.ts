import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionCategory } from '../../lib/entities/transaction-category.entity';
import { Transaction } from '../../lib/entities/transaction.entity';
import { TransactionCategoryDTO, TransactionDTO } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<TransactionCategoryDTO>,

    @InjectRepository(TransactionCategory)
    private transactionCategoryRepository: Repository<TransactionCategory>,
    private readonly httpService: HttpService,
  ) {}

  async getAll(
    limit: number,
    offset: number,
  ): Promise<TransactionCategoryDTO[]> {
    return this.transactionRepository.query(
      `SELECT transaction.id, transaction.amount, transaction.type, transaction."createdAt", transaction."updatedAt", transaction."bankId", ARRAY_AGG(tc."categoryId") AS "categoryId"
      FROM transaction
      LEFT JOIN transaction_category tc ON transaction.id = tc."transactionId"
      GROUP BY transaction.id
      limit ${limit}
      offset ${offset};`,
    );
  }

  postTransaction(params: TransactionDTO) {
    return this.transactionRepository.query(`
    BEGIN;

INSERT INTO transaction ("amount", "type", "bankId")
VALUES ('${params.amount}', '${params.type}', '${params.bankId}');

INSERT INTO transaction_category ("transactionId", "categoryId")
VALUES
${params.categories.map(
  (item) => `((SELECT id FROM transaction ORDER BY id DESC LIMIT 1), ${+item})`,
)}
  ;

  UPDATE bank SET balance = balance ${
    params.type === 'profitable' ? '+' : '-'
  } ${params.amount} WHERE id = ${params.bankId};
  
COMMIT;
    `);
  }

  async getHook(status: number) {
    await this.httpService
      .post(process.env.WEBHOOK, {
        status,
      })
      .subscribe({
        complete: () => {
          this.logger.log(`completed`);
        },
        error: (err) => {
          this.logger.log(err);
        },
      });
  }

  deleteById(id: string) {
    return this.transactionRepository.query(
      `BEGIN;

      DELETE FROM transaction_category
        WHERE transaction_category."transactionId" = (SELECT id FROM transaction where id=${id});

        DELETE FROM transaction
        WHERE transaction.id = ${id};

        COMMIT;
          `,
    );
  }
}
