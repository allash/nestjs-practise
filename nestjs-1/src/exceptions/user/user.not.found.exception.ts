import { DtoError } from './../../shared/dto/dto.error';
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super(new DtoError('user_not_found'));
  }
}
