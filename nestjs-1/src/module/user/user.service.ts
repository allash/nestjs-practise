import { UserNotFoundException } from './../../exceptions/user.not.found.exception';
import { UserMapper } from './user.mapper';
import { DbUser } from './../db/entities/user.entity';
import { UserRepository } from './../db/repositories/user.repository';
import { DbConstants } from './../../constants/db.constants';
import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { DtoGetUsersResponse } from './dto/response/dto.get.users.response';
import { DtoCreateUserRequest } from './dto/request/dto.create.user.request';

@Injectable()
export class UserService {
  constructor(
    @Inject(DbConstants.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async getUsers(): Promise<DtoGetUsersResponse[]> {
    const users = await this.userRepository.find();

    return this.userMapper.toDtoGetUsersResponse(users);
  }

  async createUser(dto: DtoCreateUserRequest) {
    const user = new DbUser();
    user.firstName = dto.firstName;
    user.age = dto.age;

    await this.userRepository.save(user);
  }

  async testForbidden() {
    throw new ForbiddenException('Forbidden');
  }

  async testUserNotFound() {
    throw new UserNotFoundException('user_not_found');
  }
}
