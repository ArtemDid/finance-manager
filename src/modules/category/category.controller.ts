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
  constructor(private readonly bankService: CategoryService) {}

  @Get()
  getAll(): Promise<Category[]> {
    return this.bankService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Category> {
    return this.bankService.getById(id);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createCategorySchema))
  async postBank(@Query() params: CategoryDTO) {
    const bank = await this.bankService.postBank(params);

    this.logger.log(bank.raw[0].id + ' was upseted');
    return bank.raw;
  }

  @Put(':id')
  @UsePipes(new JoiValidationPipe(createCategorySchema))
  async putBank(@Param('id') id: string, @Query() params: CategoryDTO) {
    const bank = await this.bankService.putBank(params, id);

    if (!bank.affected) {
      this.logger.log(`wasn't updated`);
      return new HttpException(`wasn't updated`, HttpStatus.BAD_GATEWAY);
    }

    this.logger.log('was updated');
    return new HttpException(`was updated`, HttpStatus.OK);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const bank = await this.bankService.deleteById(id);

    if (!bank.affected) {
      this.logger.log(`wasn't deleted`);
      return new HttpException(`wasn't deleted`, HttpStatus.BAD_GATEWAY);
    }

    this.logger.log('was deleted');
    return new HttpException(`was deleted`, HttpStatus.OK);
  }
}
