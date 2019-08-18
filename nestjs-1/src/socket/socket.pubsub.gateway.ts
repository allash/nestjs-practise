import { ChatConstants } from './../module/chat/chat.constants';
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import uuid = require('uuid');
import { RedisProviders } from '../module/redis/redis.providers';

const GROUP_CHAT_TOPIC = 'GROUP_CHAT_TOPIC';

interface UserConnection {
  client: Socket;
  user?: ChatUser;
}

interface ChatUser {
  username: string;
}

@WebSocketGateway(8082)
export class SocketPubSubGateway {
  private logger = new Logger(SocketPubSubGateway.name);
  private readonly userConnections: Map<string, UserConnection> = new Map<string, UserConnection>();

  private redisPub!: any;
  private redisSub!: any;

  async afterInit() {
    this.redisPub = await RedisProviders[0].useFactory();
    this.redisSub = await RedisProviders[1].useFactory();
  }

  private onHandleConnectionError = (err: any) => {
    this.logger.debug(err);
  }

  async handleConnection(client: Socket) {
    client.off('error', this.onHandleConnectionError);
    client.on('error', this.onHandleConnectionError);

    const socketId = uuid.v4();
    client.id = socketId;
    this.logger.debug('handleConnection: ' + client.id);

    this.userConnections.set(socketId, { client });

    const packet = {
      event: ChatConstants.RESULT.CHAT_HANDSHAKE_RESULT,
      data: { socketId },
    };

    await this.redisSub.subscribe(GROUP_CHAT_TOPIC);
    await this.redisSub.subscribe(client.id);
    this.redisSub.on('message', (topic: any, data: any) => {
      this.logger.debug('topic: ' + topic);
      client.send(data);
    });

    client.send(JSON.stringify(packet));
  }

  handleDisconnect(client: Socket) {
    this.logger.log('handleDisconnect: ' + client.id);
    this.userConnections.delete(client.id);
  }

  @SubscribeMessage(ChatConstants.EVENT.GROUP_CHAT_JOIN_EVENT)
  async handleUserJoined(socket: Socket, payload: any) {
    this.logger.debug(ChatConstants.EVENT.GROUP_CHAT_JOIN_EVENT);
    const userConnection = this.userConnections.get(socket.id);
    if (!userConnection) {
      throw new Error(`Socket not connected with clientId: ${socket.id}`);
    }
    this.logger.debug('user connection found: ' + userConnection.client.id);
    userConnection.user = { username: payload.username };
    const packet = {
      event: ChatConstants.RESULT.CHAT_JOIN_RESULT,
      data: {
        id: userConnection.client.id,
        username: userConnection.user.username
      },
    };
    await this.redisPub.publish(GROUP_CHAT_TOPIC, JSON.stringify(packet));
  }

  public dispatchMessageSend(socketId: string, payload: any) {
    this.logger.debug('dispatchMessageSend');
  }
}
