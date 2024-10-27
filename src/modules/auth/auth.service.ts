import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

import { IUser } from '../users/types';
import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { IRefreshToken } from './types';

dotenv.config();

const TIME_ACCESS_TOKEN = 60 * 10 * 1000;
const TIME_REFRESH_TOKEN = 60 * 90 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(user: IUser): Promise<any> {
    const userDB = await this.validateUser(user);
    const { password, ...result } = userDB;
    const tokens = await this.generateTokens(userDB);
    return { ...result, ...tokens };
  }

  async refresh(refreshToken: IRefreshToken): Promise<any> {
    const userDB = await this.verifyToken(refreshToken.refreshToken);
    const { password, ...result } = userDB;
    const tokens = await this.generateTokens(userDB);
    return { ...result, ...tokens };
  }

  private async generateTokens(user: Users): Promise<any> {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: TIME_ACCESS_TOKEN,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: TIME_REFRESH_TOKEN,
      }),
    };
  }

  private async verifyToken(refreshToken: string) {
    if (!refreshToken) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const userName = this.jwtService.decode(refreshToken)['username'];
    const user = await this.usersService.findOneUsername(userName);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      return user;
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Assinatura Inválida');
      }
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expirado');
      }
      throw new UnauthorizedException(err.name);
    }
  }

  private async validateUser(user: IUser): Promise<Users> {
    const userDB = await this.usersService.validateUser(user);
    if (!userDB) throw new UnauthorizedException();
    return userDB;
  }
}
