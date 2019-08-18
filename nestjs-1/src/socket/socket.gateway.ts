import { ChatConstants } from './../module/chat/chat.constants';
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway
} from '@nestjs/websockets';
import uuid = require('uuid');

import { Socket } from 'socket.io';

interface ChatUserConnection {
  client: Socket;
  user?: ChatUser;
}

interface ChatUser {
  username: string;
}

@WebSocketGateway(8080)
export class SocketGateway {
  private logger = new Logger(SocketGateway.name);
  private readonly userConnections: Map<string, ChatUserConnection> = new Map<string, ChatUserConnection>();

  private onHandleConnectionError = (err: any) => {
    this.logger.debug(err);
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
