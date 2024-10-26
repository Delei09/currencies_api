import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard } from './auth.guards';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  describe('canActivate', () => {
    it('should allow access if the route is public', async () => {
      const mockContext = {
        getHandler: jest.fn().mockReturnValue(jest.fn()),
        getClass: jest.fn().mockReturnValue(jest.fn()),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
        }),
      };

      mockReflector.getAllAndOverride.mockReturnValue(true); 

      expect(await authGuard.canActivate(mockContext as any)).toBe(true);
    });

    it('should throw UnauthorizedException if token is not provided', async () => {
      const mockContext = {
        getHandler: jest.fn().mockReturnValue(jest.fn()),
        getClass: jest.fn().mockReturnValue(jest.fn()),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
        }),
      };

      mockReflector.getAllAndOverride.mockReturnValue(false); // Simula que a rota não é pública

      await expect(authGuard.canActivate(mockContext as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const mockContext = {
        getHandler: jest.fn().mockReturnValue(jest.fn()),
        getClass: jest.fn().mockReturnValue(jest.fn()),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer invalidToken' },
          }),
        }),
      };

      mockReflector.getAllAndOverride.mockReturnValue(false); // Simula que a rota não é pública
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token')); // Simula token inválido

      await expect(authGuard.canActivate(mockContext as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should allow access and assign user payload to request if token is valid', async () => {
      const mockContext = {
        getHandler: jest.fn().mockReturnValue(jest.fn()),
        getClass: jest.fn().mockReturnValue(jest.fn()),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: { authorization: 'Bearer validToken' },
          }),
        }),
      };

      const payload = { sub: 1, username: 'testuser' };
      mockReflector.getAllAndOverride.mockReturnValue(false); // Simula que a rota não é pública
      mockJwtService.verifyAsync.mockResolvedValue(payload); // Simula token válido

      const result = await authGuard.canActivate(mockContext as any);
      expect(result).toBe(true);
      expect(mockContext.switchToHttp().getRequest().user).toEqual(payload); // Verifica se o payload foi atribuído
    });
  });
});
