import { IsNotEmpty, IsEmail } from 'class-validator';

export class DtoLoginRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
