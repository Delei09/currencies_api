import { IsNotEmpty } from 'class-validator';

export class CredenciatesDto {
  @IsNotEmpty({ message: 'O campo usuário não pode estar vazio.' })
  username: string;

  @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' })
  password: string;
}
