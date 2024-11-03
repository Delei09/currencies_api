import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post } from '@nestjs/common';

import { Public } from '../../decorator/public';
import { UserDto } from './dto/user-dto';
import { UsersService } from './users.service';

// TODO: ADD ROTE PARA RECUPERAR SENHA
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() body: UserDto) {
    try {
      return await this.usersService.create(body);
    } catch (err) {
      throw new HttpException(
        err.detail || err.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  delete(@Body() id: number) {
    return this.usersService.delete(id);
  }

  @Patch(':id')
  async update(@Body() body: Omit<UserDto, 'password'>) {
    //TODO: ALTERAR OMIT E CRIAR UMA NOVA ROTA APENAS PARA ADD MOEDA
    try {
      return await this.usersService.update(body);
    } catch (err) {
      throw new HttpException(
        err.detail || err.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  findOne(@Body() id: number) {
    return this.usersService.findOne(id);
  }
}
