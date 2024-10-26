import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserDto } from './dto/user-dto';

// TODO: ADD ROTE PARA RECUPERAR SENHA
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: UserDto) {
    return this.usersService.create(body);
  }

  @Delete(':id')
  delete(@Body() id: number) {
    return this.usersService.delete(id);
  }

  @Patch(':id')
  update(@Body() body: UserDto) {
    return this.usersService.update(body);
  }

  @Get(':id')
  findOne(@Body() id: number) {
    return this.usersService.findOne(id);
  }
}
