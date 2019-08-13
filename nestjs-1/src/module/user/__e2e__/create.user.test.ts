import { SessionModule } from './../../session/session.module';
import { SessionService } from './../../session/session.service';
import { flushRedis } from './../../../__test__/utilities';
import { AppConstants } from './../../../config/constants';
import { HttpStatus } from '@nestjs/common';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import EntityBuilder from '../../../__test__/entity.builder';
import { recreateSchema } from '../../../__test__';
import * as request from 'supertest';
import { DtoCreateUserRequest } from '../dto/request/dto.create.user.request';
import { DbUser } from '../../db/entities/user.entity';

describe('User Controller', () => {
  let context: TestContext;

  let entityBuilder: EntityBuilder;

  let sessionService: SessionService;

  const API_URL = `/${AppConstants.API_PREFIX}/users`;

  beforeAll(async () => {
    context = await getContext(true);
    sessionService = context.app
      .select(SessionModule)
      .get<SessionService>(SessionService);
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
    user: DbUser;
    authToken: string;
    body: DtoCreateUserRequest;
  }

  const validContext = async (): Promise<AuthContext> => {
    const userRequest = { email: 'test@mail.com', password: '1234' };

    const user = await entityBuilder.createUser(
      userRequest.email,
      userRequest.password,
    );

    const authToken = (await sessionService.login(userRequest)).token;

    const body: DtoCreateUserRequest = {
      firstName: 'Michael',
      lastName: 'Doe',
      email: 'michael.doe@mail.com',
      password: '134',
    };

    return { user, authToken, body };
  };

  describe('POST - ' + API_URL, () => {
    it('expects 201 with created user', async () => {
      const ctx = await validContext();

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .send(ctx.body)
        .expect(HttpStatus.CREATED);

      const createdUser = await entityBuilder.userRepo.findOne({
        email: ctx.body.email,
      });

      expect(createdUser).not.toBeNull();
      expect(createdUser!.email).toEqual(ctx.body.email);
      expect(createdUser!.firstName).toEqual(ctx.body.firstName);
      expect(createdUser!.lastName).toEqual(ctx.body.lastName);
    });

    it('expects 400 when user does not have valid email', async () => {
      const ctx = await validContext();
      ctx.body.email = 'michael@mail';

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .send(ctx.body)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('expects 400 when user has empty email', async () => {
      const ctx = await validContext();
      delete ctx.body.email;

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .send(ctx.body)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('expects 400 when user has empty first name', async () => {
      const ctx = await validContext();
      delete ctx.body.firstName;

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .send(ctx.body)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('expects 400 when user has empty last name', async () => {
      const ctx = await validContext();
      delete ctx.body.lastName;

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .send(ctx.body)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('expects 400 when user has empty password', async () => {
      const ctx = await validContext();
      delete ctx.body.password;

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .send(ctx.body)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
