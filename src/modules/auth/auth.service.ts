import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUser } from '../users/types';
import { UsersService } from '../users/users.service';

const TIME_ACCESS_TOKEN = 60 * 10 * 1000;
const TIME_REFRESH_TOKEN = 60 * 90 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(user: IUser): Promise<any> {
    const userDB = await this.usersService.validateUser(user);
    if (!userDB) throw new UnauthorizedException();

    const { password, ...result } = userDB;

    const payload = { sub: user.id, username: user.username };
    return {
      user: result,
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: TIME_ACCESS_TOKEN,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: TIME_REFRESH_TOKEN,
      }),
    };
  }
}
