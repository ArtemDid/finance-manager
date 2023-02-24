import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from '../entity/bank.entity';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private usersRepository: Repository<Bank>,
  ) {}

  getAll(): Promise<Bank[]> {
    return this.usersRepository.find();
  }
  // getAll(): string {
  //   return 'Get All';
  // }
}
