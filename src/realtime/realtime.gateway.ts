import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CurrenciesService } from '../modules/currencies/currencies.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealTimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(private currenciesService: CurrenciesService) {}

  @SubscribeMessage('currencies')
  async getCurrencies(client: Socket): Promise<void> {
    const currencies = await this.currenciesService.getCurrencies();
    this.server.emit('currencies', currencies);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getRealTimeMessage')
  handleGetRealTimeMessage(client: Socket): void {
    client.emit('realTimeMessage', 'Hello from server');
  }
}