import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Users } from './users/users.entity';

  dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_DB,
      port: parseInt(process.env.PORT_DB),
      username: process.env.USERNAME_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.NAME_DB,
      entities: [Users],
      synchronize: true,
      migrationsRun: true,
      migrations: ['database/migrations/*.ts'],
    }),
    UsersModule,
  ],
})
export class AppModule {}
