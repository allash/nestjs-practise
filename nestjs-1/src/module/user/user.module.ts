import { UserFileRepository } from './../db/repositories/user.file.repository';
import { UserMapper } from './user.mapper';
import { UserRepository } from './../db/repositories/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from '../../utils/s3.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserMapper, S3Service],
  imports: [TypeOrmModule.forFeature([UserRepository, UserFileRepository])],
})
export class UserModule {}
