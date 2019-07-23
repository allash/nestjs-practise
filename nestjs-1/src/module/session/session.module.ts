import { UserRepository } from './../db/repositories/user.repository';
import { SessionRepository } from './../db/repositories/session.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionMapper } from './session.mapper';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionMapper],
  imports: [TypeOrmModule.forFeature([SessionRepository, UserRepository])],
})
export class SessionModule { }
