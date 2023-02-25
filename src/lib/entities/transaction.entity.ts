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
} from 'typeorm';
import { Bank } from './bank.entity';

export type TransactionFormat = 'profitable' | 'consumable';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['profitable', 'consumable'],
    default: 'profitable',
  })
  type: TransactionFormat;

  @ManyToOne((type) => Bank)
  @JoinColumn()
  bank: Bank;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
