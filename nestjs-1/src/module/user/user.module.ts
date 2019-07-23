import { UserMapper } from './user.mapper';
import { UserRepository } from './../db/repositories/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UserController],
  providers: [UserService, UserMapper],
  imports: [TypeOrmModule.forFeature([UserRepository])]
})
export class UserModule {}
