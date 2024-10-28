import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ICurrency } from './types';

const URL_GET_ALL_CURRENCIES =
  'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,AUD-BRL,CAD-BRL,CHF-BRL,CNY-BRL,ARS-BRL,MXN-BRL,ETH-BRL';

@Injectable()
export class CurrenciesService {
  constructor(private readonly httpService: HttpService) {}
  async getCurrencies(): Promise<ICurrency[]> {
    const { data } = await this.httpService.axiosRef.get(
      URL_GET_ALL_CURRENCIES,
    );
    return data;
  }

  async getCurrency(code: string): Promise<ICurrency[]> {
    // TODO: Implementar mecanismo de cache
    //TODO: IMPLEMENTAR MECANISMO DE DADOS NO MONGO DB

    const { data } = await this.httpService.axiosRef.get(
      `${URL_GET_ALL_CURRENCIES}/${code}-BRL`,
    );
    return data;
  }
}
