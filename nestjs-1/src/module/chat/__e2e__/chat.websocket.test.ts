import { ChatConstants } from './../chat.constants';
import { HttpStatus, Logger } from '@nestjs/common';
import { AppConstants } from './../../../config/constants';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import * as request from 'supertest';
import * as WebSocket from 'ws';
import uuid = require('uuid');

describe('ChatControllerTest', () => {
  const API_URL = `/${AppConstants.API_PREFIX}/chat`;
  const WS_URL = 'ws://localhost:8080';

  let context: TestContext;
  let ws: WebSocket;

  const logger = new Logger('ChatControllerTest');

  beforeAll(async () => {
    context = await getContext(true);
  });

  afterAll(async () => {
    await context.tearDown();
    if (ws) {
      ws.close();
    }
  });

  describe('ws test', () => {
    it('expects valid username and message', async () => {
      const username = uuid.v4();
      const message = uuid.v4();

      ws = new WebSocket(WS_URL);
      const socketId = await new Promise(resolve =>
        ws.on('open', () => {
          ws.on('message', (packet: any) => {
            const response = JSON.parse(packet);
            switch (response.event) {
              case ChatConstants.RESULT.CHAT_HANDSHAKE_RESULT:
                logger.debug(ChatConstants.RESULT.CHAT_HANDSHAKE_RESULT);
                const id = response.data.socketId;
                expect(id).toBeDefined();
                resolve(id);
                break;
              case ChatConstants.RESULT.CHAT_JOIN_RESULT:
                logger.debug(ChatConstants.RESULT.CHAT_JOIN_RESULT);
                expect(username).toEqual(response.data.username);
                resolve();
                break;
              case ChatConstants.RESULT.CHAT_MESSAGE_RESULT:
                logger.debug(ChatConstants.RESULT.CHAT_MESSAGE_RESULT);
                expect(username).toEqual(response.data.username);
                expect(message).toEqual(response.data.message);
                break;
            }
          });
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
