import { IEvent } from '@nestjs/cqrs';
import { DtoCreateUserRequest } from '../../dto/request/dto.create.user.request';

export class UserCreatedEvent implements IEvent {
    constructor(
        public readonly dto: DtoCreateUserRequest
    ) { }
}
