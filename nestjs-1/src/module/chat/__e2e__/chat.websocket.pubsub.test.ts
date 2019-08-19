import { ChatConstants } from './../chat.constants';
import { HttpStatus, Logger } from '@nestjs/common';
import { AppConstants } from './../../../config/constants';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import * as request from 'supertest';
import * as WebSocket from 'ws';
import uuid = require('uuid');

const workerId = process.env.JEST_WORKER_ID ? +process.env.JEST_WORKER_ID : 0;

describe('ChatPubSubTest', () => {
  const API_URL = `/${AppConstants.API_PREFIX}/chat`;
  const WS_URL = `ws://localhost:${9100 + workerId}`;

  let context: TestContext;
  let ws1: WebSocket;
  let ws2: WebSocket;

  const logger = new Logger('ChatPubSubTest');

  beforeAll(async () => {
    context = await getContext(true);
  });

  afterAll(async () => {
    await context.tearDown();
    if (ws1 != null && ws1 !== undefined) {
      ws1.close();
    }

    if (ws2 != null && ws2 !== undefined) {
      ws2.close();
    }
  });

  describe('ws pubsub test', () => {
    it('expects valid username and message', async () => {
      // console.log(`WS_URL: ${WS_URL}`);
      ws1 = new WebSocket(WS_URL);
      await new Promise(resolve =>
        ws1.on('open', () => {
          resolve();
        }),
      );

      const username = uuid.v4();
      const message = uuid.v4();

      const socketId1 = await new Promise(resolve => {
        ws1.on('message', (packet: any) => {
          const response = JSON.parse(packet);
          if (response.event === ChatConstants.RESULT.CHAT_HANDSHAKE_RESULT) {
            logger.debug('Promise 1: ' + response.event + ', id: ' + response.data.socketId);
            resolve(response.data.socketId);
          }
        });
      });

      ws2 = new WebSocket(WS_URL);
      await new Promise(resolve =>
        ws2.on('open', () => {
          resolve();
        }),
      );

      await new Promise(resolve => {
        ws2.on('message', (packet: any) => {
          const response = JSON.parse(packet);
          if (response.event === ChatConstants.RESULT.CHAT_HANDSHAKE_RESULT) {
            logger.debug('Promise 1: ' + response.event + ', id: ' + response.data.socketId);
            resolve(response.data.socketId);
          }
        });
      });

      ws1.send(
        JSON.stringify({
          event: ChatConstants.EVENT.GROUP_CHAT_JOIN_EVENT,
          data: { username }
        }),
      );

      await new Promise(resolve => {
        ws1.on('message', (packet: any) => {
          const response = JSON.parse(packet);
          if (response.event === ChatConstants.RESULT.CHAT_JOIN_RESULT) {
            logger.debug('Promise 2: ' + response.event + ', id: ' + response.data.id);
            expect(response.data.id).toEqual(socketId1);
            resolve();
          }
        });
      });

      await new Promise(resolve => {
        ws2.on('message', (packet: any) => {
          const response = JSON.parse(packet);
          if (response.event === ChatConstants.RESULT.CHAT_JOIN_RESULT) {
            logger.debug('Promise 2: ' + response.event + ', id: ' + response.data.id);
            expect(response.data.id).toEqual(socketId1);
            resolve();
          }
        });
      });

      // // send message
      // await request(context.server)
      //   .post(`${API_URL}/pubsub-message`)
      //   .send({ socketId, message })
      //   .expect(HttpStatus.OK);
    });
  });
});
