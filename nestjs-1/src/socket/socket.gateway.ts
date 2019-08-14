import { PubSubChatUserConnection } from './socket.gateway';
import { ChatConstants } from './../module/chat/chat.constants';
import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import * as WebSocket from 'ws';
import uuid = require('uuid');

import { RedisClient } from 'redis';
import { Socket, Server } from 'socket.io';
import { UserService } from '../module/user/user.service';
import { RedisAdapter } from 'socket.io-redis';

const GROUP_CHAT_1_TOPIC = 'GROUP_CHAT_1_TOPIC';
const USER_CHAT_TOPIC_PREFIX = 'USER_CHAT_TOPIC_PREFIX';

@WebSocketGateway(8080)
export class SocketGateway {
  @WebSocketServer() public server: Server;
  private logger = new Logger(SocketGateway.name);
  private readonly userConnections: Record<string, ChatUserConnection> = {};
  private readonly pubSubUserConnections: Map<string, PubSubChatUserConnection> = new Map<string, PubSubChatUserConnection>();

  // public redisAdapter: RedisAdapter;

  private onHandleConnectionError = (err: any) => {
    this.logger.debug(err);
  }

  afterInit(server: SocketIO.Namespace) {
    // this.redisAdapter = server.adapter as RedisAdapter;
  }

  handleConnection(client: Socket) {
    client.off('error', this.onHandleConnectionError);
    client.on('error', this.onHandleConnectionError);
    client.id = uuid.v4();
    this.logger.log('handleConnection: ' + client.id);
    this.pubSubUserConnections.set(client.id, { client });
  }

  handleDisconnect(client: Socket) {
    this.logger.log('handleDisconnect: ' + client.id);
    this.pubSubUserConnections.delete(client.id);
  }

  @SubscribeMessage(ChatConstants.EVENT.CHAT_HANDSHAKE_EVENT)
  public onChatHandshake(client: any, data: any): WsResponse<string> {
    this.logger.debug('onChatHandshake');

    const socketId = uuid.v4();
    this.userConnections[socketId] = { client };

    return {
      event: ChatConstants.RESULT.CHAT_HANDSHAKE_RESULT,
      data: JSON.stringify({ socketId }),
    };
  }

  public dispatchUserJoined(socketId: string, payload: any) {
    this.logger.debug('dispatchUserJoined');

    const userConnection = this.userConnections[socketId];
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

    const userConnection = this.userConnections[socketId];
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

  /// PubSub

  // private redisPub = new RedisClient({ port: 6380 });
  // private redisSub = new RedisClient({ port: 6380 });

  // @SubscribeMessage(ChatConstants.EVENT.PUBSUB_CHAT_HANDSHAKE_EVENT)
  // public onPubSubChatHandshake(client: Socket, data: any): WsResponse<string> {
  //   this.logger.debug('onPubSubChatHandshake');

  //   this.redisSub.on('message', (topic: any, requestPacket: any) => {
  //     if (topic === `${USER_CHAT_TOPIC_PREFIX}_${client.id}`) {
  //       console.log(`USER_CHAT_TOPIC: ${requestPacket}`);

  //       const responsePacket = {
  //         event: ChatConstants.RESULT.PUBSUB_CHAT_MESSAGE_RESULT,
  //         data: { id: client.id, username: requestPacket.username }
  //       };

  //       client.send(JSON.stringify(responsePacket));
  //     } else if (topic === GROUP_CHAT_1_TOPIC) {
  //       const responsePacket = {
  //         event: ChatConstants.RESULT.PUBSUB_CHAT_JOIN_RESULT,
  //         data: { id: client.id, message: requestPacket.message }
  //       };
  //       client.send(JSON.stringify(responsePacket));
  //     }
  //   });

  //   this.redisPub.subscribe(`${USER_CHAT_TOPIC_PREFIX}_${client.id}`);
  //   this.redisPub.subscribe(GROUP_CHAT_1_TOPIC);

  //   return {
  //     event: ChatConstants.RESULT.PUBSUB_CHAT_HANDSHAKE_RESULT,
  //     data: JSON.stringify({ socketId: client.id }),
  //   };
  // }

  // public dispatchPubSubUserJoined(socketId: string, payload: any) {
  //   this.logger.debug('dispatchPubSubUserJoined');

  //   const userConnection = this.pubSubUserConnections.get(socketId);
  //   if (!userConnection) {
  //    this.redisPub.publish(GROUP_CHAT_1_TOPIC, payload.username);
  //   } else {
  //     userConnection.user = { username: payload.username };

  //     const packet = {
  //       event: ChatConstants.RESULT.PUBSUB_CHAT_JOIN_RESULT,
  //       data: { id: userConnection.client.id, username: userConnection.user.username } ,
  //     };

  //     this.pubSubUserConnections.forEach((connection, key) => {
  //       if (key !== socketId) { connection.client.send(JSON.stringify(packet)); }
  //     });
  //   }
  // }
}

export interface ChatUserConnection {
  client: WebSocket;
  user?: ChatUser;
}

export interface PubSubChatUserConnection {
  client: Socket;
  user?: ChatUser;
}

export interface ChatUser {
  username: string;
}
