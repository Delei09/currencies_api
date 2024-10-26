import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'O campo username não pode estar vazio.' })
  username: string;

  @IsEmail({}, { message: 'O email fornecido não é válido.' })
  email: string;

  @IsNotEmpty({ message: 'O campo password não pode estar vazio.' })
  password: string;
}