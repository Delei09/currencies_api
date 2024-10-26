import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { Public } from '../../decorator/public';
import { UserDto } from '../users/dto/user-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() user: UserDto) {
    return this.authService.signIn(user);
  }
}