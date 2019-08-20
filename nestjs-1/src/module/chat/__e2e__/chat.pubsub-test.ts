import { WsAdapter } from '@nestjs/platform-ws';
import { ChatConstants } from './../chat.constants';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppConstants } from './../../../config/constants';
import * as request from 'supertest';
import * as WebSocket from 'ws';
import uuid = require('uuid');
import { Test } from '@nestjs/testing';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SocketGateway } from '../../../socket/socket.gateway';
import * as express from 'express';

class InnerContext {
  public server: Express.Application = express();
  public app: INestApplication;
}
describe.skip('ChatControllerTest', () => {
  const API_URL = `/${AppConstants.API_PREFIX}/chat`;
  const WS_URL = 'ws://localhost';

  let contex1: InnerContext;
  let contex2: InnerContext;

  let ws1: WebSocket;
  let ws2: WebSocket;

  const createApp = async (port: number, ...providers: any) => {
    const server = express();
    const testModule = await Test.createTestingModule({
      providers: [providers],
    }).compile();

    const expressAdapter = new ExpressAdapter(server);
    const app = testModule.createNestApplication(expressAdapter);

    await app.useWebSocketAdapter(new WsAdapter(app) as any);
    await app.listen(port);
    return { app, server };
  };

  beforeAll(async () => {
    contex1 = await createApp(4000, SocketGateway);
    contex2 = await createApp(4001, SocketGateway);
  });

  afterEach(async () => {
    if (contex1.app) {
      await contex1.app.close();
    }
    if (contex2.app) {
      await contex2.app.close();
    }
    if (ws1) {
      ws1.close();
    }
    if (ws2) {
      ws2.close();
    }
  });

  describe('ws test', () => {
    it('expects valid username and message', async () => {
      ws1 = new WebSocket(`${WS_URL}:4000`);
      await new Promise(resolve =>
        ws1.on('open', () => {
          resolve();
        }),
      );

      ws1.send(
        JSON.stringify({
          event: ChatConstants.EVENT.CHAT_HANDSHAKE_EVENT,
        }),
      );

      ws2 = new WebSocket(`${WS_URL}:4001`);
      await new Promise(resolve =>
        ws2.on('open', () => {
          resolve();
        }),
      );

      ws2.send(
        JSON.stringify({
          event: ChatConstants.EVENT.CHAT_HANDSHAKE_EVENT,
        }),
      );

      const username = uuid.v4();

      const socketId1 = await new Promise(resolve =>
        ws1.on('message', (packet: any) => {
          const res = JSON.parse(packet);
          switch (res.event) {
            case ChatConstants.RESULT.CHAT_HANDSHAKE_RESULT:
              const id = JSON.parse(res.data).socketId;
              expect(id).toBeDefined();
              resolve(id);
              break;
          }
        }),
      );

      await new Promise(resolve =>
        ws1.on('message', (packet: any) => {
          const res = JSON.parse(packet);
          switch (res.event) {
            case ChatConstants.RESULT.CHAT_HANDSHAKE_RESULT:
              const id = JSON.parse(res.data).socketId;
              expect(id).toBeDefined();
              resolve(id);
              break;
            case ChatConstants.RESULT.CHAT_JOIN_RESULT:
              expect(username).toEqual(res.data.username);
              resolve();
              break;
          }
        }),
      );

      // join chat
      await request(contex1.server)
        .post(`${API_URL}/join`)
        .send({ socketId1, username })
        .expect(HttpStatus.OK);
    });
  });
});
