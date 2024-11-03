import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from './types';
import { Users } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create({ username, password, email }: IUser) {
    const userWithSameUsername = await this.findOneUsername(username);
    if (userWithSameUsername) {
      throw new Error('Usuario já existe');
    }

    const userWithSameEmail = await this.usersRepository.findOneBy({ email });
    if (userWithSameEmail) {
      throw new Error('Email já existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      email,
      currenciesFavorite: [],
    });
    return this.usersRepository.save(user);
  }

  findOne(id: number): Promise<Users | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneUsername(username: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async delete(id: number): Promise<string> {
    await this.usersRepository.delete(id);
    return 'deleted user with id: ' + id;
  }

  async update({ id, username, currenciesFavorite }: Omit<IUser, 'password'>) {
    const user = await this.findOne(id);
    user.username = username;
    // TODO: DAR ROOLBACK DEPOIS
    // user.password = password;
    user.currenciesFavorite = currenciesFavorite;
    return this.usersRepository.save(user);
  }

  async validateUser({ username, password }: IUser): Promise<false | Users> {
    const user = await this.findOneUsername(username);
    if (!user) return false;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : false;
  }
}
