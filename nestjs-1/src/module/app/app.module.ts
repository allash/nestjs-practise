import { AppController } from './app.controller';
import { AuthFilterMiddleware } from './../../middleware/auth.filter.middleware';
import { SessionModule } from './../session/session.module';
import { DbModule } from './../db/db.module';
import { UserModule } from './../user/user.module';
import { LoggerMiddleware } from '../../middleware/logger.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AppController],
  imports: [TypeOrmModule.forRoot(), UserModule, DbModule, SessionModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthFilterMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
