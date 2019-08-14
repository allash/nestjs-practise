import { SocketGateway } from './../../socket/socket.gateway';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(private readonly socketGateway: SocketGateway) {}

  public joinChat = (socketId: string, username: string) => {
    this.socketGateway.dispatchUserJoined(socketId, { username });
  }

  public sendMessage = (socketId: string, message: string) => {
    this.socketGateway.dispatchMessageSend(socketId, { message });
  }

  // PubSub
  public pubSubJoinChat = (socketId: string, username: string) => {
    // this.socketGateway.dispatchPubSubUserJoined(socketId, { username });
  }
}
