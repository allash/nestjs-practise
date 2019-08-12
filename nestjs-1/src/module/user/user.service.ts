import { UserNotFoundByIdException } from './../../exceptions/user/user.not.found.by.id.exception';
import { UserNotFoundException } from '../../exceptions/user/user.not.found.exception';
import { UserMapper } from './user.mapper';
import { DbUser } from './../db/entities/user.entity';
import { UserRepository } from './../db/repositories/user.repository';
import { DbConstants } from '../db/db.constants';
import { Injectable, Inject, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DtoGetUsersResponse } from './dto/response/dto.get.users.response';
import { DtoCreateUserRequest } from './dto/request/dto.create.user.request';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsException } from '../../exceptions/user/user.already.exists.exception';
import { S3Service } from '../../utils/s3.service';
import { DtoUserFileUploadResponse } from './dto/response/dto.user.file.upload.response';
import { UserFileRepository } from '../db/repositories/user.file.repository';
import { DbUserFile } from '../db/entities/user.file.entity';
import uuid = require('uuid');

@Injectable()
export class UserService {
  constructor(
    @Inject(DbConstants.USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    @Inject(DbConstants.USER_FILE_REPOSITORY)
    private readonly userFileRepo: UserFileRepository,
    private readonly userMapper: UserMapper,
    private readonly s3Service: S3Service
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
    user.lastName = dto.lastName;

    await this.userRepo.save(user);
  }

  async testForbidden() {
    throw new ForbiddenException('Forbidden');
  }

  async testUserNotFound() {
    throw new UserNotFoundException();
  }

  async uploadFile(userId: string, file: Express.Multer.File): Promise<DtoUserFileUploadResponse> {
    if (file == null) {
      throw new BadRequestException('no file uploaded');
    }

    const user = await this.userRepo.findOne(userId);
    if (user == null) { throw new UserNotFoundByIdException(userId); }

    const userFile = new DbUserFile();
    userFile.name = uuid.v4();
    userFile.originalName = file.originalname;
    userFile.mimeType = file.mimetype;
    userFile.size = file.size;
    userFile.user = user;
    userFile.userId = user.id;
    await this.userFileRepo.save(userFile);

    const signedUrl = await this.s3Service.upload(file.buffer, file.originalname, file.mimetype);
    return { signedUrl };
  }
}
