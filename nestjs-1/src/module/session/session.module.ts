import { RedisModule } from './../redis/redis.module';
import { UserRepository } from './../db/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionMapper } from './session.mapper';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionMapper],
  imports: [
    RedisModule,
    TypeOrmModule.forFeature([UserRepository])
  ],
})
export class SessionModule { }
