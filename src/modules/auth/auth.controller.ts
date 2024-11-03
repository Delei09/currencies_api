import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public } from '../../decorator/public';
import { UserDto } from '../users/dto/user-dto';
import { AuthService } from './auth.service';
import { IRefreshToken } from './types';
import { CredenciatesDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() user: CredenciatesDto) {
    return this.authService.signIn(user);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() refreshToken: IRefreshToken) {
    return this.authService.refresh(refreshToken);
  }
}