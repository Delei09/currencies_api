import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CurrenciesController } from './currencies.controller';
import { Currency, CurrencySchema } from './currencies.schema';
import { CurrenciesService } from './currencies.service';

@Module({
  providers: [CurrenciesService],
  controllers: [CurrenciesController],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CacheModule.register(),
    MongooseModule.forFeature([
      { name: Currency.name, schema: CurrencySchema },
    ]),
  ],
})
export class CurrenciesModule {}
