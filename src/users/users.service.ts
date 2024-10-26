import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserProps } from './types';
import { Users } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create({ username, password }: UserProps) {
    const user = this.usersRepository.create({ username, password });
    return this.usersRepository.save(user);
  }

  findOne(username: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async update({ id, username, password, currenciesFavorite }: UserProps) {
    const user = await this.findOne(id);
    user.username = username;
    user.password = password;
    user.currenciesFavorite = currenciesFavorite;
    return this.usersRepository.save(user);
  }
}
