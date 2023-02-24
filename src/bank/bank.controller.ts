import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Logger,
  HttpException,
  UseFilters,
} from '@nestjs/common';
import { Bank } from '../entity/bank.entity';
import { ErrorFilter } from '../error/error.filter';
import { BankService } from './bank.service';

@Controller('bank')
export class BankController {
  private readonly logger = new Logger(BankController.name);
  constructor(private readonly bankService: BankService) {}

  @Get()
  // @UseFilters(ErrorFilter)
  getAll(): Promise<Bank[]> {
    throw new HttpException('RRRRRRR', HttpStatus.FORBIDDEN);
    return this.bankService.getAll();
  }

  @Post('/order')
  async getHook() {
    this.logger.warn('Doing something...');
    await this.bankService.getHook();
    return 'kkkkk';
  }
}
