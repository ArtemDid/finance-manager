import Joi = require('joi');

export const createCategorySchema = Joi.object({
  name: Joi.string().required().min(3).trim(),
});

export class CategoryDTO {
  readonly name: string;
}
