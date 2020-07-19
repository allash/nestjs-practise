import { DbUser } from './../../../db/entities/user.entity';
import { Logger } from '@nestjs/common';
import { UserRepository } from './../../../db/repositories/user.repository';
import { CreateUserCommand } from './../impl/create.user.command';
import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import * as uuid from 'uuid';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    
    private readonly logger = new Logger(CreateUserHandler.name);

    constructor(
        private readonly userRepo: UserRepository,
        private readonly eventPublisher: EventPublisher
    ) { }

    async execute(command: CreateUserCommand) {
        this.logger.debug('CreateUserHandler execute...');
        const { dto } = command;
        
        const u = new DbUser();
        u.id = uuid.v4();
        u.firstName = dto.firstName;
        u.lastName = dto.lastName;

        const user = this.eventPublisher.mergeObjectContext(
            await this.userRepo.create(u),
        );
        
        user.commit();
    }
 }
