import { IsNotEmpty, IsEmail } from 'class-validator';

export class DtoCreateUserRequest {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    age: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
