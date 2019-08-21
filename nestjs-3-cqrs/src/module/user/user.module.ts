import { UserRepository } from './../db/repositories/user.repository';
import { CommandHandlers } from './commands/handlers/index';
import { UserController } from './user.controller';
import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { EventHandlers } from './events/handlers';
import { CqrsModule, EventBus, CommandBus } from '@nestjs/cqrs';
import { EventStoreModule } from '../../core/event-store/event-store.module';
import { EventStore } from '../../core/event-store/event-store';
import { UserCreatedEvent } from './events/impl/user.created.event';

@Module({
  imports: [CqrsModule, EventStoreModule.forFeature()],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit() {
    this.eventStore.setEventHandlers(this.eventHandlers);
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;

    this.event$.register(EventHandlers);
    this.command$.register(CommandHandlers);
  }

  eventHandlers = {
    UserCreatedEvent: data => new UserCreatedEvent(data),
  };
}
