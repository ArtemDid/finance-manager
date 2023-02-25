import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../lib/entities/category.entity';
import { CategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categotyRepository: Repository<Category>,
    private readonly httpService: HttpService,
  ) {}

  getAll(): Promise<Category[]> {
    return this.categotyRepository.find();
  }

  getById(id: string): Promise<Category> {
    return this.categotyRepository.findOneBy({
      id: +id,
    });
  }

  postBank(params: CategoryDTO) {
    return this.categotyRepository.upsert(params, ['name']);
  }

  putBank(params: CategoryDTO, id: string) {
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
