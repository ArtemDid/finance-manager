import { Controller, Get } from '@nestjs/common';
import { Bank } from '../entity/bank.entity';
import { BankService } from './bank.service';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  getAll(): Promise<Bank[]> {
    return this.bankService.getAll();
  }
}
