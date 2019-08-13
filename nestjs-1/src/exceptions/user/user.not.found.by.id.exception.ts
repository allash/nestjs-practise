import { DtoError } from './../../shared/dto/dto.error';
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundByIdException extends NotFoundException {
  constructor(userId: string) {
    super(new DtoError('user_not_found_by_id', [userId]));
  }
}
