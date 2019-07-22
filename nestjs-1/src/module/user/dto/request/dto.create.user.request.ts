import { IsNotEmpty } from 'class-validator';

export class DtoCreateUserRequest {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    age: number;
}
