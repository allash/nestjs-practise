import { Logger } from '@nestjs/common';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../impl/user.created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> { 
    private logger = new Logger(UserCreatedHandler.name);
    handle(event: UserCreatedEvent) { 
        this.logger.debug('UserCreatedEvent handle');
    }
}
