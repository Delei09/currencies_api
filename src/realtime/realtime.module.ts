import { Module } from '@nestjs/common';
import { CurrenciesModule } from 'src/modules/currencies/currencies.module';

import { RealTimeGateway } from './realtime.gateway';

@Module({
  imports: [CurrenciesModule],
  providers: [RealTimeGateway],
})
export class RealTimeModule {}
