import { ICommand } from '@nestjs/cqrs';
import { DtoCreateUserRequest } from '../../dto/request/dto.create.user.request';

export class CreateUserCommand implements ICommand { 
    constructor(public readonly dto: DtoCreateUserRequest) { }
}
