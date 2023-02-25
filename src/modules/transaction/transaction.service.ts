import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionCategory } from '../../lib/entities/transaction-category.entity';
import { Transaction } from '../../lib/entities/transaction.entity';
import { TransactionCategoryDTO } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<TransactionCategoryDTO>,

    @InjectRepository(TransactionCategory)
    private transactionCategoryRepository: Repository<TransactionCategory>,
    private readonly httpService: HttpService,
  ) {}

  async getAll(): Promise<TransactionCategoryDTO[]> {
    return this.transactionRepository.query(
      `SELECT transaction.id, transaction.amount, transaction.type, transaction."createdAt", transaction."updatedAt", transaction."bankId", ARRAY_AGG(tc."categoryId") AS "categoryId"
      FROM transaction
      LEFT JOIN transaction_category tc ON transaction.id = tc."transactionId"
      GROUP BY transaction.id;`,
    );
  }
}
