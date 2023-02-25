import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity';
import { Transaction } from './transaction.entity';

@Entity('transaction_category')
export class TransactionCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Transaction)
  @JoinColumn()
  transaction: Transaction;

  @ManyToOne((type) => Category)
  @JoinColumn()
  category: Category;
}
