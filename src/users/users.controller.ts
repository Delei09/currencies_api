import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

import { UserProps } from './types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: UserProps) {
    return this.usersService.create(body);
  }

  @Delete(':id')
  delete(@Body() id: number) {
    return this.usersService.delete(id);
  }

  @Patch(':id')
  update(@Body() body: UserProps) {
    return this.usersService.update(body);
  }

  @Get(':id')
  findOne(@Body() id: number) {
    return this.usersService.findOne(id);
  }
}
