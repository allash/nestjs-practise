import { UserNotFoundException } from '../../exceptions/user/user.not.found.exception';
import { SessionMapper } from './session.mapper';
import { UserRepository } from './../db/repositories/user.repository';
import { SessionRepository } from './../db/repositories/session.repository';
import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { DtoLoginRequest } from './dto/request/dto.login.request';
import { DbConstants } from '../db/db.constants';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { DbSession } from '../db/entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @Inject(DbConstants.USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    @Inject(DbConstants.SESSION_REPOSITORY)
    private readonly sessionRepo: SessionRepository,
    private readonly sessionMapper: SessionMapper
  ) {}

  async login(dto: DtoLoginRequest) {
    const user = await this.userRepo.findOneByEmail(dto.email);
    if (!user) { throw new UserNotFoundException(); }

    const result = await bcrypt.compare(dto.password, user.password);
    if (result === false) { throw new UserNotFoundException(); }

    const token = uuid.v4();

    const session = new DbSession();
    session.token = token;
    session.user = user;
    session.userId = user.id;
    await this.sessionRepo.save(session);

    return this.sessionMapper.toDtoLoginResponse(token);
  }
}
