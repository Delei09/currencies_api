import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'O campo usuario não pode estar vazio.' })
  username: string;

  @IsEmail({}, { message: 'O email fornecido não é válido.' })
  email: string;

  @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, { message: 'A senha deve ter no mínimo 8 caracteres, incluindo letras, números e caracteres especiais.' })
  password: string;
}