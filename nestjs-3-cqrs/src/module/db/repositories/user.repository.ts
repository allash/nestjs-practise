import { User } from './../../user/models/user.model';
import { DbUser } from './../entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import uuid = require('uuid');

@Injectable()
export class UserRepository {
  private logger = new Logger(UserRepository.name);

  async create(user: DbUser) {
    this.logger.debug('UserRepository create');
    this.logger.debug(user);
    const model = new User(uuid.v4());
    model.setData(user);
    model.createUser();
    return model;
  }

  async findAll(): Promise<DbUser[]> {
    return new Promise(resolve => {
      resolve();
    });
  }
}
