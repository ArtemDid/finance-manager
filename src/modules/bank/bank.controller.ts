import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Logger,
  HttpException,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Res,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Bank } from '../../lib/entities/bank.entity';
import { ErrorFilter } from '../../lib/middlewares/error/error.filter';
import { BankService } from './bank.service';
import { BankDTO, createBankSchema } from './dto/bank.dto';
import { JoiValidationPipe } from '../../lib/validator/validator';
import { ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
  private readonly logger = new Logger(BankController.name);
  constructor(private readonly bankService: BankService) {}

  @Get()
  getAll(): Promise<Bank[]> {
    return this.bankService.getAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getById(@Param('id') id: string): Promise<Bank> {
    return this.bankService.getById(id);
  }

  @Post()
  @ApiQuery({ type: BankDTO })
  @UsePipes(new JoiValidationPipe(createBankSchema))
  async postBank(@Query() params: BankDTO) {
    const bank = await this.bankService.postBank(params);

    this.logger.log(bank.raw[0].id + ' was upseted');
    return bank.raw;
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiQuery({ type: BankDTO })
  @UsePipes(new JoiValidationPipe(createBankSchema))
  async putBank(@Param('id') id: string, @Query() params: BankDTO) {
    const bank = await this.bankService.putBank(params, id);

    if (!bank.affected) {
      this.logger.warn(`wasn't updated`);
      return new HttpException(`wasn't updated`, HttpStatus.BAD_GATEWAY);
    }

    this.logger.log('was updated');
    return new HttpException(`was updated`, HttpStatus.OK);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async deleteById(@Param('id') id: string) {
    const bank = await this.bankService.deleteById(id);

    if (!bank[1]) {
      this.logger.warn(`wasn't deleted`);
      return new HttpException(`wasn't deleted`, HttpStatus.BAD_GATEWAY);
    }

    this.logger.log('was deleted');
    return new HttpException(`was deleted`, HttpStatus.OK);
  }
}
