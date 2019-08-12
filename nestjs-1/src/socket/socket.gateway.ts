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

@WebSocketGateway(8080)
export class SocketGateway {

  @WebSocketServer() public server: any;
  private logger = new Logger(SocketGateway.name);
  private readonly userConnections: Record<string, ChatUserConnection> = {};

  private onHandleConnectionError = (err: any) => {
    this.logger.debug(err);
  }

  async handleConnection(client: any) {
    client.off('error', this.onHandleConnectionError);
    client.on('error', this.onHandleConnectionError);
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

    const packet = { event: ChatConstants.RESULT.CHAT_JOIN_RESULT, data: userConnection.user };
    userConnection.client.send(JSON.stringify(packet));
  }

  public dispatchMessageSend(socketId: string, payload: any) {
    this.logger.debug('dispatchMessageSend');

    const userConnection = this.userConnections[socketId];
    if (!userConnection) {
      throw new Error(`Socket not connected with clientId: ${socketId}`);
    }

    payload.username = userConnection.user!!.username;

    const packet = { event: ChatConstants.RESULT.CHAT_MESSAGE_RESULT, data: payload };

    userConnection.client.send(
      JSON.stringify(packet),
    );
  }
}

export interface ChatUserConnection {
  client: WebSocket;
  user?: ChatUser;
}

export interface ChatUser {
  username: string;
}
