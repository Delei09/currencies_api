import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { UserProps } from './types';
import { Users } from './users.entity';
import { UsersService } from './users.service';
import * as dotenv from 'dotenv';

dotenv.config();
describe('UsersService (Integration)', () => {
  let service: UsersService;
  let db: DataSource;

  const userProps: UserProps = {
    username: 'testuser',
    password: 'password',
    email: 'email@email.com',
    currenciesFavorite: [],
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        }),
        TypeOrmModule.forFeature([Users]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    db = module.get<DataSource>(getDataSourceToken());
  });

  afterAll(async () => {
    await db.destroy(); // close connection
  });

  beforeEach(async () => {
    // clean database
    await db.getRepository(Users).clear();
  });

  it('should create a user', async () => {
    const user = await service.create(userProps);
    expect(user).toBeDefined();
    expect(userProps.username).toEqual(user.username);
  });

  it('should find a user with id', async () => {
    const user = await service.create(userProps);
    const findUser = await service.findOne(user.id);
    expect(findUser).toBeDefined();
    expect(findUser.username).toEqual(user.username);
  });

  it('should update a user', async () => {
    const user = await service.create(userProps);

    const updatedUser = await service.update({
      id: user.id,
      username: 'updateduser',
      password: 'password',
      email: 'email@email.com',
      currenciesFavorite: [],
    });

    const findUser = await service.findOne(updatedUser.id);
    expect(findUser.username).toEqual('updateduser');
  });

  it('should find a user with username', async () => {
    const user = await service.create(userProps);
    const findUser = await service.findOneUsername(user.username);
    expect(findUser).toBeDefined();
    expect(findUser.username).toEqual(user.username);
  });

  it('should delete a user', async () => {
    const user = await service.create(userProps);

    const userDeleted = await service.delete(user.id);

    const findUser = await service.findOne(user.id);
    expect(findUser).toEqual(null);

    expect(userDeleted).toEqual('deleted user with id: 1');
  });

  it('should validate a user', async () => {
    await service.create(userProps);
    const validateUser = await service.validateUser(userProps);
    expect(validateUser).toEqual(true);
  });

  it('should call error validate a user', async () => {
    const validateUser = await service.validateUser(userProps);
    expect(validateUser).toEqual(false);
  });
});
