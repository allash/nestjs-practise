import { ChatModule } from './../chat/chat.module';
import { InvoiceModule } from './../invoice/invoice.module';
import { DbConstants } from './../db/db.constants';
import { Fixtures } from './../../config/fixtures';
import { AppController } from './app.controller';
import { AuthFilterMiddleware } from './../../middleware/auth.filter.middleware';
import { SessionModule } from './../session/session.module';
import { DbModule } from './../db/db.module';
import { UserModule } from './../user/user.module';
import { LoggerMiddleware } from '../../middleware/logger.middleware';
import { Module, NestModule, MiddlewareConsumer, Inject } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    DbModule,
    InvoiceModule,
    SessionModule,
    RedisModule,
    ChatModule,
  ],
})
export class AppModule implements NestModule {
  public async onModuleInit() {
    if (process.env.FIXTURES === 'true') {
      const fixtures = new Fixtures();
      await fixtures.run(this.connection, this.redisService);
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthFilterMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  constructor(
    @Inject(DbConstants.DB_CONNECTION) private readonly connection: Connection,
    private redisService: RedisService,
  ) {}
}
