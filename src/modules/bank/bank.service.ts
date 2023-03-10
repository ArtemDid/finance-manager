import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'express';
import { Repository } from 'typeorm';
import { Bank } from '../../lib/entities/bank.entity';
import { Transaction } from '../../lib/entities/transaction.entity';
import { BankDTO } from './dto/bank.dto';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
    private readonly httpService: HttpService,
  ) {}

  getAll(): Promise<Bank[]> {
    return this.bankRepository.find();
  }

  getById(id: string): Promise<Bank> {
    return this.bankRepository.findOneBy({
      id: +id,
    });
  }

  postBank(params: BankDTO) {
    return this.bankRepository.upsert(params, ['name']);
  }

  putBank(params: BankDTO, id: string) {
    return this.bankRepository
      .createQueryBuilder()
      .update(Bank)
      .set(params)
      .where('id = :id', { id: +id })
      .execute();
  }

  deleteById(id: string) {
    return this.bankRepository.query(
      `DELETE FROM bank
      WHERE bank.id = ${id}
        AND NOT EXISTS (
          SELECT 1
          FROM transaction
          WHERE transaction."bankId" = ${id}
        );`,
    );
  }
}
