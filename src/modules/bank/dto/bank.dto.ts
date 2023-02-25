import Joi = require('joi');

export const createBankSchema = Joi.object({
  name: Joi.string().required().min(3).trim(),
  balance: Joi.number().required(),
  // id: Joi.string().optional(),
});

export class BankDTO {
  readonly name: string;
  readonly balance: number;
}
