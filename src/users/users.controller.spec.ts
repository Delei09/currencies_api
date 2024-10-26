import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let service: UsersService;
  let controller: UsersController;
  const result = {
    id: 1,
    username: 'update',
    password: 'update',
    email: 'update',
    currenciesFavorite: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method', async () => {
    const body = {
      username: 'username',
      password: 'password',
      email: 'email',
    };
    jest.spyOn(service, 'create').mockResolvedValue(result);

    await expect(controller.create(body)).resolves.toEqual(result);
  });

  it('should call update method', async () => {
    const body = {
      username: 'update',
      password: 'update',
      email: 'update',
    };
    jest.spyOn(service, 'update').mockResolvedValue(result);

    await expect(controller.update(body)).resolves.toEqual(result);
  });

  it('should call finOne method', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(result);

    await expect(controller.findOne(1)).resolves.toEqual(result);
  });

  it('should call delete method', async () => {
    jest.spyOn(service, 'delete').mockResolvedValue('deleted user with id: 1');
    await expect(controller.delete(1)).resolves.toEqual('deleted user with id: 1');
  });
});

