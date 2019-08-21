import { CreateUserCommand } from './commands/impl/create.user.command';
import { DtoCreateUserRequest } from './dto/request/dto.create.user.request';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(private readonly commandBus: CommandBus) {}

  async createUser(dto: DtoCreateUserRequest) {
    this.logger.debug('UserService createUser...');
    await this.commandBus.execute(new CreateUserCommand(dto));
  }

  async getUsers(): Promise<any[]> {
    return [];
  }
}
