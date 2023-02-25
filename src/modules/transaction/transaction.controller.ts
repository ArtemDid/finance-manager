import { Controller, Get, Logger } from '@nestjs/common';
import { Transaction } from '../../lib/entities/transaction.entity';
import { TransactionCategoryDTO } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getAll(): Promise<TransactionCategoryDTO[]> {
    return this.transactionService.getAll();
  }
}
