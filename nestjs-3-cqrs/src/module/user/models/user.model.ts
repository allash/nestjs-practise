import { Logger } from '@nestjs/common';
import { UserCreatedEvent } from './../events/impl/user.created.event';
import { AggregateRoot } from '@nestjs/cqrs';
import { DbUser } from '../../db/entities/user.entity';

export class User extends AggregateRoot {
  [x: string]: any;
  private logger = new Logger(User.name);
  private user: DbUser;

  constructor(private readonly id: string | undefined) {
    super();
  }

  setData(user: DbUser) {
    this.user = user;
  }

  createUser() { 
      this.logger.debug('UserModel createUser');
      this.logger.debug(this.user);
      this.apply(new UserCreatedEvent(this.user));
  }
}
