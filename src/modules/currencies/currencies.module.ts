import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';

@Module({
  providers: [CurrenciesService],
  controllers: [CurrenciesController],
  imports: [ HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }),]
})
export class CurrenciesModule {}
