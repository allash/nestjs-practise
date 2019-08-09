import { UserNotFoundException } from '../../exceptions/user/user.not.found.exception';
import { SessionMapper } from './session.mapper';
import { UserRepository } from './../db/repositories/user.repository';
import { Injectable, Inject } from '@nestjs/common';
import { DtoLoginRequest } from './dto/request/dto.login.request';
import { DbConstants } from '../db/db.constants';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SessionService {
  constructor(
    @Inject(DbConstants.USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    private readonly sessionMapper: SessionMapper,
    private readonly redisService: RedisService
  ) {}

  async login(dto: DtoLoginRequest) {
    const user = await this.userRepo.findOneByEmail(dto.email);
    if (!user) { throw new UserNotFoundException(); }

    const result = await bcrypt.compare(dto.password, user.password);
    if (result === false) { throw new UserNotFoundException(); }

    const token = uuid.v4();

    await this.redisService.set(token, user.id);

    return this.sessionMapper.toDtoLoginResponse(token);
  }
}
