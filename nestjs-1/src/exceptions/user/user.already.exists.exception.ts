import { DtoError } from './../../shared/dto/dto.error';
import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExistsException extends BadRequestException {
    constructor() {
        super(new DtoError('user_already_exists'));
    }
}
