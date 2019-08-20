import { SocketPubSubGateway } from './../../socket/socket.pubsub.gateway';
import { SocketGateway } from './../../socket/socket.gateway';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly socketPubSubGateway: SocketPubSubGateway
    ) {}

  public joinChat = (socketId: string, username: string) => {
    this.socketGateway.dispatchUserJoined(socketId, { username });
  }

  public sendMessage = (socketId: string, message: string) => {
    this.socketGateway.dispatchMessageSend(socketId, { message });
  }

  // PubSub
  public pubSubSendMessage = (socketId: string, message: string) => {
    this.socketPubSubGateway.dispatchMessageSend(socketId, { message });
  }
}
