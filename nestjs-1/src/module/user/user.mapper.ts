import { DtoGetUsersResponse } from './dto/response/dto.get.users.response';
import { DbUser } from './../db/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {
  public toDtoGetUsersResponse(users: DbUser[]): DtoGetUsersResponse[] {
    return users.map(
      (user: DbUser) =>
        new DtoGetUsersResponse(
          user.id,
          user.email,
          user.firstName,
          user.lastName,
        ),
    );
  }
}
