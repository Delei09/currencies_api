import { Test, TestingModule } from '@nestjs/testing';

import { UserDto } from '../users/dto/user-dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  describe('signIn', () => {
    it('should call signIn with correct userDto', async () => {
      const userDto: UserDto = { username: 'testuser', password: 'testpass', email: 'testemail' };
      mockAuthService.signIn.mockResolvedValue({ token: 'fake_token' }); 

      const result = await authController.signIn(userDto);

      expect(authService.signIn).toHaveBeenCalledWith(userDto); 
      expect(authService.signIn).toHaveBeenCalledTimes(1); 
      expect(result).toEqual({ token: 'fake_token' }); 
    });
  });
});
