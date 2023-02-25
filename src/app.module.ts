import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankModule } from './modules/bank/bank.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './lib/entities/bank.entity';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './lib/middlewares/error/error.filter';
import { CategoryController } from './modules/category/category.controller';
import { CategoryModule } from './modules/category/category.module';
import { Category } from './lib/entities/category.entity';
import { TransactionModule } from './modules/transaction/transaction.module';
import { Transaction } from './lib/entities/transaction.entity';
import { TransactionCategory } from './lib/entities/transaction-category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Bank, Category, Transaction, TransactionCategory],
      synchronize: true,
      migrations: ['migrations/'],
      autoLoadEntities: true,
      logging: true,
    }),
    CategoryModule,
    BankModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
