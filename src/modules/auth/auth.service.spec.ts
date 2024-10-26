import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const userMock = {
    id: 1,
    username: 'testuser',
    password: 'testpass',
    email: 'user@example.com',
  };

  const userDBMock = {
    id: 1,
    username: 'testuser',
    password: 'hashedpassword',
    email: 'user@example.com',
  };

  const mockUsersService = {
    validateUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('signIn', () => {
    it('should return access and refresh tokens on successful sign in', async () => {
      mockUsersService.validateUser.mockResolvedValue(userDBMock);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access_token')
        .mockResolvedValueOnce('refresh_token');

      const result = await authService.signIn(userMock);

      expect(usersService.validateUser).toHaveBeenCalledWith(userMock);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        user: {
          id: 1,
          username: 'testuser',
          email: 'user@example.com',
        },
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });
    });

    it('should throw UnauthorizedException if user is not valid', async () => {
      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(authService.signIn(userMock)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.validateUser).toHaveBeenCalledWith(userMock);
    });
  });
});
