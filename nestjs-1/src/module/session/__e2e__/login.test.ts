import { flushRedis } from './../../../__test__/utilities';
import { AppConstants } from './../../../config/constants';
import { HttpStatus } from '@nestjs/common';
import { DtoLoginRequest } from './../dto/request/dto.login.request';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import EntityBuilder from '../../../__test__/entity.builder';
import { recreateSchema } from '../../../__test__';
import * as request from 'supertest';
import { DtoLoginResponse } from '../dto/response/dto.login.response';

describe('Session Controller', () => {
  let context: TestContext;

  let entityBuilder: EntityBuilder;

  const API_URL = `/${AppConstants.API_PREFIX}/sessions/login`;

  beforeAll(async () => {
    context = await getContext(true);
  });

  beforeEach(async () => {
    await Promise.all([
      recreateSchema(context.connection),
      flushRedis(context.app),
    ]);
    entityBuilder = await EntityBuilder.create(context.connection);
  });

  afterAll(async () => {
    await context.tearDown();
  });

  class AuthContext {
    body: DtoLoginRequest;
  }

  const validContext = async (): Promise<AuthContext> => {
    const email = 'random@mail.com';
    const password = '12355';

    await entityBuilder.createUser(email, password);

    const body = new DtoLoginRequest();
    body.email = email;
    body.password = password;

    return { body };
  };

  describe('POST - ' + API_URL, () => {
    it('expects 200 with session token response', async () => {
      const ctx = await validContext();

      const response = await request(context.server)
        .post(API_URL)
        .send(ctx.body)
        .expect(HttpStatus.OK);

      expect(response.body).not.toBeUndefined();

      const result: DtoLoginResponse = response.body;
      expect(result.token).not.toEqual(null);
    });

    it('expects 404 when log in with invalid email', async () => {
      const ctx = await validContext();
      ctx.body.email = 'test33@mail.com';

      await request(context.server)
        .post(API_URL)
        .send(ctx.body)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('expects 400 with invalid email format', async () => {
      const ctx = await validContext();
      ctx.body.email = 'test33@mail';

      await request(context.server)
        .post(API_URL)
        .send(ctx.body)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('expects 400 without email', async () => {
      const ctx = await validContext();
      delete ctx.body.email;

      await request(context.server)
        .post(API_URL)
        .send(ctx.body)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('expects 400 without password', async () => {
      const ctx = await validContext();
      delete ctx.body.password;

      await request(context.server)
        .post(API_URL)
        .send(ctx.body)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
