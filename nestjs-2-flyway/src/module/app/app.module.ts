import { DbModule } from '../db/db.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [TypeOrmModule.forRoot(), DbModule, UserModule]
})
export class AppModule {}
