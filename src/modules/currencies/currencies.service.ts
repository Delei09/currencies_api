import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { Connection, Model } from 'mongoose';

import { Currency } from './currencies.schema';
import { ICode, ICurrency } from './types';

const URL_GET_ALL_CURRENCIES =
  'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,AUD-BRL,CAD-BRL,CHF-BRL,CNY-BRL,ARS-BRL,MXN-BRL,ETH-BRL';

const TIME_EXPIRED_CACHE = 0.5 * 60 * 1000;
const TIME_EXPIRED_CURRENCY = 24 * 60 * 60 * 1000;
const KEY_REDIS = 'currencies';

@Injectable()
export class CurrenciesService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<Currency>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getCurrencies(): Promise<ICurrency[]> {
    const currencies = await this.cacheManager.get<ICurrency[]>(KEY_REDIS);
    if (currencies) {
      return currencies;
    }
    return await this.getDataAndSave();
  }

  async getCurrency(code: ICode): Promise<ICurrency[]> {
    return await this.findByCode(code.code);
  }

  private async saveData(currencies: Record<string, Currency>) {
    // TODO:ATUALIZAR A FORMA DE SALVAR NO MONGO
    // for (const key in currencies) {
    //   if (currencies.hasOwnProperty(key)) {
    //     const data = currencies[key];
    //     const currencyDoc = new this.currencyModel(data);
    //     await currencyDoc.save();
    //   }
    // }
  }

  private async findByCode(code: string): Promise<Currency[]> {
    return await this.fetchLastPriceCurrency(code);
    //TODO implementar cache
    // return this.currencyModel.find({ code }).exec();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async handleCron() {
    await this.getDataAndSave();
  }

  private async getDataAndSave(): Promise<ICurrency[]> {
    const { data } = await this.httpService.axiosRef.get(
      URL_GET_ALL_CURRENCIES,
    );
    await this.cacheManager.set(KEY_REDIS, data, TIME_EXPIRED_CACHE);
    await this.saveData(data);

    return data;
  }

  async fetchLastPriceCurrency(code: string): Promise<Currency[]> {
    const date = new Date();
    const lastDays = new Date(date.getTime() - 10 * 24 * 60 * 60 * 1000);

    const startDate = lastDays.toISOString().split('T')[0].replace(/-/g, '');
    const endDate = date.toISOString().split('T')[0].replace(/-/g, '');

    const url = `https://economia.awesomeapi.com.br/${code}-BRL/10?start_date=${startDate}&end_date=${endDate}`;

    const cacheKey = `currencies:${code}`;

    try {
      const cached = await this.cacheManager.get<Currency[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const { data } = await this.httpService.axiosRef.get<Currency[]>(url);

      await this.cacheManager.set(cacheKey, data, TIME_EXPIRED_CURRENCY);

      return data;
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  }
}
