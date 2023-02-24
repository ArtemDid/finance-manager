import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from '../entity/bank.entity';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private usersRepository: Repository<Bank>,
    private readonly httpService: HttpService,
  ) {}

  getAll(): Promise<Bank[]> {
    return this.usersRepository.find();
  }
  async getHook() {
    await this.httpService
      .post('https://webhook.site/08890e33-e16d-4b57-959b-951f72825849', {
        status: HttpStatus.OK,
      })
      .subscribe({
        complete: () => {
          console.log('completed');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
