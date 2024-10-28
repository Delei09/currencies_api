import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { ICurrency } from './types';

@Controller('currencies')
export class CurrenciesController {

  constructor(private readonly currenciesService: CurrenciesService) {}
  @Get()
  async getCurrencies(): Promise<ICurrency[]> {
    return this.currenciesService.getCurrencies();
  }

  @Get(':code')
  async getCurrency( code: string):  Promise<ICurrency[]>  {
    return this.currenciesService.getCurrency(code);
  }
}
