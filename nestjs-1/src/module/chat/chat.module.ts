import { SocketPubSubGateway } from './../../socket/socket.pubsub.gateway';
import { SocketGateway } from './../../socket/socket.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, SocketGateway, SocketPubSubGateway],
  imports: [RedisModule, UserModule]
})
export class ChatModule {}
