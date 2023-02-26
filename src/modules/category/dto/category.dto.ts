import Joi = require('joi');

export const createCategorySchema = Joi.object({
  name: Joi.string().required().min(3).trim(),
});

export const createCategoryStatSchema = Joi.object({
  categoryIds: Joi.array().items(Joi.number().required()).required(),
  fromPeriod: Joi.date().required(),
  toPeriod: Joi.date().required(),
});

export class CategoryDTO {
  readonly name: string;
}

export class CategoryStatDTO {
  readonly categoryIds: Array<number>;
  readonly fromPeriod: Date;
  readonly toPeriod: Date;
}
