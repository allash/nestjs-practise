import { UserNotFoundException } from '../../exceptions/user/user.not.found.exception';
import { UserMapper } from './user.mapper';
import { DbUser } from './../db/entities/user.entity';
import { UserRepository } from './../db/repositories/user.repository';
import { DbConstants } from '../db/db.constants';
import { Injectable, Inject, ForbiddenException, Logger } from '@nestjs/common';
import { DtoGetUsersResponse } from './dto/response/dto.get.users.response';
import { DtoCreateUserRequest } from './dto/request/dto.create.user.request';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsException } from '../../exceptions/user/user.already.exists.exception';

@Injectable()
export class UserService {
  constructor(
    @Inject(DbConstants.USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

  async getUsers(): Promise<DtoGetUsersResponse[]> {
    const users = await this.userRepo.find({ order: { email: 'ASC' } });
    return this.userMapper.toDtoGetUsersResponse(users);
  }

  async createUser(dto: DtoCreateUserRequest) {
    const existingUser = await this.userRepo.findOneByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const user = new DbUser();
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, 10);
    user.firstName = dto.firstName;
    user.age = dto.age;

    await this.userRepo.save(user);
  }

  async testForbidden() {
    throw new ForbiddenException('Forbidden');
  }

  async testUserNotFound() {
    throw new UserNotFoundException();
  }
}
