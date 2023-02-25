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
    private usersRepository: Repository<Category>,
    private readonly httpService: HttpService,
  ) {}

  getAll(): Promise<Category[]> {
    return this.usersRepository.find();
  }

  getById(id: string): Promise<Category> {
    return this.usersRepository.findOneBy({
      id: +id,
    });
  }

  postBank(params: CategoryDTO) {
    return this.usersRepository.upsert(params, ['name']);
  }

  putBank(params: CategoryDTO, id: string) {
    return this.usersRepository
      .createQueryBuilder()
      .update(Category)
      .set(params)
      .where('id = :id', { id: +id })
      .execute();
  }

  deleteById(id: string) {
    return this.usersRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id: +id })
      .execute();
  }
}
