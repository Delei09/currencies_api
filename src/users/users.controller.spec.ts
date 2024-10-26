import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDto } from './dto/user-dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  const userDto: UserDto = {
    username: 'testuser',
    password: 'password',
    email: 'user@example.com',
  };

  const mockUsersService = {
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('Should create user', async () => {
    await controller.create(userDto);
    expect(service.create).toHaveBeenCalledWith(userDto);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('Should delete user', async () => {
    const id = 1;
    await controller.delete(id);

    expect(service.delete).toHaveBeenCalledWith(id);
    expect(service.delete).toHaveBeenCalledTimes(1);
  });

  it('Should update user', async () => {
    const userDto: UserDto = {
      username: 'updateduser',
      password: 'newpassword',
      email: 'updated@example.com',
    };
    await controller.update(userDto);

    expect(service.update).toHaveBeenCalledWith(userDto);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('Should find user', async () => {
    const id = 1;
    await controller.findOne(id);

    expect(service.findOne).toHaveBeenCalledWith(id);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });
});
