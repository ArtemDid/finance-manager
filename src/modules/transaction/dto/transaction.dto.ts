import Joi = require('joi');
import { TransactionCategory } from '../../../lib/entities/transaction-category.entity';
import {
  Transaction,
  TransactionFormat,
} from '../../../lib/entities/transaction.entity';

export const createTransactionSchema = Joi.object({
  amount: Joi.number().required(),
  type: Joi.string().valid('profitable', 'consumable').required(),
  bank: Joi.number().required(),
  categories: Joi.array().items(Joi.number().required()).required(),
});

export class TransactionDTO {
  readonly name: string;
  readonly type: TransactionFormat;
  readonly bankId: number;
  readonly categories: Array<number>;
}

export type TransactionCategoryDTO = Transaction & TransactionCategory;
