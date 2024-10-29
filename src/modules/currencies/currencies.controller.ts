import { Controller, Get, Param } from '@nestjs/common';

import { CurrenciesService } from './currencies.service';
import { ICode, ICurrency } from './types';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}
  @Get()
  async getCurrencies(): Promise<ICurrency[]> {
    return this.currenciesService.getCurrencies();
  }

  @Get(':code')
  async getCurrency(@Param() code: ICode): Promise<ICurrency[]> {
    return this.currenciesService.getCurrency(code);
  }
}
