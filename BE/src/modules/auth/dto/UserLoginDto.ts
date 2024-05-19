import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly requestFrom: string;
}
