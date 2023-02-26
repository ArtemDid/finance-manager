import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../lib/entities/category.entity';
import { CategoryDTO, CategoryStatDTO } from './dto/category.dto';

export type Statistics = { name: string; balance: number };

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categotyRepository: Repository<Category>,

    @InjectRepository(Category)
    private categotyRepositoryStat: Repository<Statistics>,

    private readonly httpService: HttpService,
  ) {}

  getAll(): Promise<Category[]> {
    return this.categotyRepository.find();
  }

  getStatistics(params: CategoryStatDTO): Promise<Array<Statistics>> {
    return this.categotyRepositoryStat.query(`
    SELECT
c.name as name,
SUM(CASE
WHEN t.type = 'profitable' THEN t.amount
ELSE -t.amount
END) as balance
FROM
category c
INNER JOIN transaction_category tc ON c.id = tc."categoryId"
INNER JOIN transaction t ON tc."transactionId" = t.id
WHERE
c.id IN (${params.categoryIds})
AND t."createdAt" BETWEEN '${params.fromPeriod}' AND '${params.toPeriod}'
GROUP BY
c.name;
    `);
  }

  getById(id: string): Promise<Category> {
    return this.categotyRepository.findOneBy({
      id: +id,
    });
  }

  postCategory(params: CategoryDTO) {
    return this.categotyRepository.upsert(params, ['name']);
  }

  putCategory(params: CategoryDTO, id: string) {
    return this.categotyRepository
      .createQueryBuilder()
      .update(Category)
      .set(params)
      .where('id = :id', { id: +id })
      .execute();
  }

  deleteById(id: string) {
    return this.categotyRepository.query(
      `DELETE FROM category
        WHERE category.id = ${id}
          AND NOT EXISTS (
            SELECT 1
            FROM transaction_category
            WHERE transaction_category."categoryId" = ${id}
          );`,
    );
  }
}
