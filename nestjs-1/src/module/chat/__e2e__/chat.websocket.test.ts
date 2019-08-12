import { ChatConstants } from './../chat.constants';
import { HttpStatus } from '@nestjs/common';
import { AppConstants } from './../../../config/constants';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import * as request from 'supertest';
import * as WebSocket from 'ws';
import uuid = require('uuid');

describe.skip('ChatControllerTest', () => {
  const API_URL = `/${AppConstants.API_PREFIX}/chat`;
  const WS_URL = 'ws://localhost:8080';

  let context: TestContext;
  let ws: WebSocket;

  beforeAll(async () => {
    context = await getContext(true);
  });

  afterAll(async () => {
    await context.tearDown();
    ws.close();
  });

  describe('ws test', () => {
    it('expects valid username and message', async () => {
      ws = new WebSocket(WS_URL);
      await new Promise(resolve =>
        ws.on('open', () => {
          resolve();
        }),
      );

      ws.send(
        JSON.stringify({
          event: ChatConstants.EVENT.CHAT_HANDSHAKE_EVENT,
        }),
      );

      const username = uuid.v4();
      const message = uuid.v4();

      const socketId = await new Promise(resolve =>
        ws.on('message', (packet: any) => {
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
            case ChatConstants.RESULT.CHAT_MESSAGE_RESULT:
              expect(username).toEqual(res.data.username);
              expect(message).toEqual(res.data.message);
              break;
          }
        }),
      );

      // join chat
      await request(context.server)
        .post(`${API_URL}/join`)
        .send({ socketId, username })
        .expect(HttpStatus.OK);

      // send message
      await request(context.server)
        .post(`${API_URL}/message`)
        .send({ socketId, message })
        .expect(HttpStatus.OK);
    });
  });
});
