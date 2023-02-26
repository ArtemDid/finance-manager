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
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Category } from '../../lib/entities/category.entity';
import { JoiValidationPipe } from '../../lib/validator/validator';
import { CategoryService, Statistics } from './category.service';
import {
  CategoryDTO,
  CategoryStatDTO,
  createCategorySchema,
  createCategoryStatSchema,
} from './dto/category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  @Get('/statistics')
  @ApiQuery({ type: CategoryStatDTO })
  @UsePipes(new JoiValidationPipe(createCategoryStatSchema))
  async getStatistics(@Query() params: CategoryStatDTO) {
    const service: Array<Statistics> = await this.categoryService.getStatistics(
      params,
    );

    const obj = {};
    for (const item of service) {
      obj[item.name] = Number(item.balance);
    }
    return obj;
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getById(id);
  }

  @Post()
  @ApiQuery({ type: CategoryDTO })
  @UsePipes(new JoiValidationPipe(createCategorySchema))
  async postBank(@Query() params: CategoryDTO) {
    const category = await this.categoryService.postCategory(params);

    this.logger.log(category.raw[0].id + ' was upseted');
    return category.raw;
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiQuery({ type: CategoryDTO })
  @UsePipes(new JoiValidationPipe(createCategorySchema))
  async putBank(@Param('id') id: string, @Query() params: CategoryDTO) {
    const category = await this.categoryService.putCategory(params, id);

    if (!category.affected) {
      this.logger.warn(`wasn't updated`);
      return new HttpException(`wasn't updated`, HttpStatus.BAD_GATEWAY);
    }

    this.logger.log('was updated');
    return new HttpException(`was updated`, HttpStatus.OK);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async deleteById(@Param('id') id: string) {
    const category = await this.categoryService.deleteById(id);

    if (!category[1]) {
      this.logger.warn(`wasn't deleted`);
      return new HttpException(`wasn't deleted`, HttpStatus.BAD_GATEWAY);
    }

    this.logger.log('was deleted');
    return new HttpException(`was deleted`, HttpStatus.OK);
  }
}
