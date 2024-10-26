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

  async create({ username, password, email }: UserProps) {
    const user = this.usersRepository.create({ username, password, email , currenciesFavorite: []});
    return this.usersRepository.save(user);
  }

  findOne(id: number): Promise<Users | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<string> {
    await this.usersRepository.delete(id);
    return 'deleted user with id: ' + id;
  }

  async update({ id, username, password, currenciesFavorite }: UserProps) {
    const user = await this.findOne(id);
    user.username = username;
    user.password = password;
    user.currenciesFavorite = currenciesFavorite;
    return this.usersRepository.save(user);
  }
}
