import { IsNotEmpty, IsEmail } from 'class-validator';

export class DtoCreateUserRequest {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
