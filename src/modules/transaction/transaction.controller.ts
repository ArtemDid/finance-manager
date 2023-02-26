import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Transaction } from '../../lib/entities/transaction.entity';
import { JoiValidationPipe } from '../../lib/validator/validator';
import {
  createTransactionSchema,
  TransactionCategoryDTO,
  TransactionDTO,
} from './dto/transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getAll(
    @Query() params: { limit: number; offset: number },
  ): Promise<TransactionCategoryDTO[]> {
    const LIMIT = params.limit || 10;
    const OFFSET = params.offset || 0;

    return this.transactionService.getAll(LIMIT, OFFSET);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createTransactionSchema))
  async postTransaction(@Query() params: TransactionDTO) {
    try {
      await this.transactionService.postTransaction(params);
      this.transactionService.getHook(HttpStatus.OK);
    } catch (err) {
      this.transactionService.getHook(HttpStatus.BAD_REQUEST);
      this.logger.warn(`wasn't upseted`);
      return new HttpException(`wasn't upseted`, HttpStatus.BAD_GATEWAY);
    }

    this.logger.log('was upseted');
    return new HttpException(`was upseted`, HttpStatus.OK);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    await this.transactionService.deleteById(id);

    this.logger.log('was deleted');
    return new HttpException(`was deleted`, HttpStatus.OK);
  }
}
