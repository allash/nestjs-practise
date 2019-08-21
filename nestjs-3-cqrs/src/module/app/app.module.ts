import { UserModule } from './../user/user.module';
import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventStoreModule } from '../../core/event-store/event-store.module';

@Module({
  imports: [EventStoreModule.forRoot(), UserModule],
  controllers: [AppController]
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {}
}
