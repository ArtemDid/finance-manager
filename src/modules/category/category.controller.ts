import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Category } from '../../lib/entities/category.entity';
import { JoiValidationPipe } from '../../lib/validator/validator';
import { CategoryService } from './category.service';
import { CategoryDTO, createCategorySchema } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getById(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createCategorySchema))
  async postBank(@Query() params: CategoryDTO) {
    const category = await this.categoryService.postBank(params);

    this.logger.log(category.raw[0].id + ' was upseted');
    return category.raw;
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(createCategorySchema))
  async putBank(@Param('id') id: string, @Query() params: CategoryDTO) {
    const category = await this.categoryService.putBank(params, id);

    if (!category.affected) {
      this.logger.log(`wasn't updated`);
      return new HttpException(`wasn't updated`, HttpStatus.BAD_GATEWAY);
    }

    this.logger.log('was updated');
    return new HttpException(`was updated`, HttpStatus.OK);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const category = await this.categoryService.deleteById(id);

    if (!category[1]) {
      this.logger.log(`wasn't deleted`);
      return new HttpException(`wasn't deleted`, HttpStatus.BAD_GATEWAY);
    }

    this.logger.log('was deleted');
    return new HttpException(`was deleted`, HttpStatus.OK);
  }
}
