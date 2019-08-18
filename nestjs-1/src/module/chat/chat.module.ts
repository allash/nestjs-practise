import { SocketPubSubGateway } from './../../socket/socket.pubsub.gateway';
import { SocketGateway } from './../../socket/socket.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ChatController],
  providers: [ChatService, SocketGateway, SocketPubSubGateway],
})
export class ChatModule {}
