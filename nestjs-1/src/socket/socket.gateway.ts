import { ChatConstants } from './../module/chat/chat.constants';
import { Logger, Inject } from '@nestjs/common';
import {
  WebSocketGateway
} from '@nestjs/websockets';
import uuid = require('uuid');

import { Socket } from 'socket.io';
import { UserService } from '../module/user/user.service';
import { RedisConstants } from '../module/redis/redis.constants';

interface ChatUserConnection {
  client: Socket;
  user?: ChatUser;
}

interface ChatUser {
  username: string;
}

const WEB_SOCKET_PORT = process.env.NODE_ENV === 'test' ? 9000 : 9001;
const workerId = process.env.JEST_WORKER_ID ? +process.env.JEST_WORKER_ID : 0;

@WebSocketGateway(WEB_SOCKET_PORT + workerId)
export class SocketGateway {
  private logger = new Logger(SocketGateway.name);
  private readonly userConnections: Map<string, ChatUserConnection> = new Map<string, ChatUserConnection>();

  private onHandleConnectionError = (err: any) => {
    this.logger.debug(err);
  }

  constructor(@Inject(RedisConstants.REDIS_CONNECTION) private readonly connection: any,
              private readonly userService: UserService) { }

  afterInit() {
    // console.log('SocketGateway. WEB_SOCKET_PORT: ' + WEB_SOCKET_PORT);
  }

  handleConnection(client: Socket) {
    client.off('error', this.onHandleConnectionError);
    client.on('error', this.onHandleConnectionError);

    const socketId = uuid.v4();
    client.id = socketId;
    this.logger.debug('handleConnection: ' + client.id);

    this.userConnections.set(socketId, { client });

    const packet = {
      event: ChatConstants.RESULT.CHAT_HANDSHAKE_RESULT,
      data: { socketId }
    };
    client.send(JSON.stringify(packet));
  }

  handleDisconnect(client: Socket) {
    this.logger.debug('handleDisconnect: ' + client.id);
    this.userConnections.delete(client.id);
  }

  public dispatchUserJoined(socketId: string, payload: any) {
    this.logger.debug('dispatchUserJoined');

    const userConnection = this.userConnections.get(socketId);
    if (!userConnection) {
      throw new Error(`Socket not connected with clientId: ${socketId}`);
    }

    userConnection.user = { username: payload.username };

    const packet = {
      event: ChatConstants.RESULT.CHAT_JOIN_RESULT,
      data: userConnection.user,
    };
    userConnection.client.send(JSON.stringify(packet));
  }

  public dispatchMessageSend(socketId: string, payload: any) {
    this.logger.debug('dispatchMessageSend');

    const userConnection = this.userConnections.get(socketId);
    if (!userConnection) {
      throw new Error(`Socket not connected with clientId: ${socketId}`);
    }

    payload.username = userConnection.user!!.username;

    const packet = {
      event: ChatConstants.RESULT.CHAT_MESSAGE_RESULT,
      data: payload,
    };

    userConnection.client.send(JSON.stringify(packet));
  }
}
