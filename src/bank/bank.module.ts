import { Module } from '@nestjs/common';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from '../entity/bank.entity';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from '../error/error.filter';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Bank])],
  controllers: [BankController],
  providers: [
    BankService,
    // {
    //   provide: APP_FILTER,
    //   useClass: ErrorFilter,
    // },
  ],
})
export class BankModule {}
