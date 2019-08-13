import { SessionModule } from './../../session/session.module';
import { SessionService } from './../../session/session.service';
import { flushRedis } from './../../../__test__/utilities';
import { HttpStatus } from '@nestjs/common';
import { AppConstants } from './../../../config/constants';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import EntityBuilder from '../../../__test__/entity.builder';
import { recreateSchema } from '../../../__test__';
import * as request from 'supertest';
import { DtoGetUsersResponse } from '../dto/response/dto.get.users.response';
import { DbUser } from '../../db/entities/user.entity';
import { RoleEnum } from '../../../config/role.enum';
import { RightsEnum } from '../../../config/rights.enum';

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
    authTokenWithAuthority: string;
    authTokenWithoutAuthority: string;
    users: DbUser[];
  }

  const validContext = async (): Promise<AuthContext> => {
    const userRequest1 = { email: 'test1@mail.com', password: '1234' };
    const userRequest2 = { email: 'test2@mail.com', password: '1234' };
    const userRequest3 = { email: 'test3@mail.com', password: '1234' };

    const users = await Promise.all(
      new Array(
        entityBuilder.createUser(
          userRequest2.email,
          userRequest2.password,
          'random1',
        ),
        entityBuilder.createUser(
          userRequest1.email,
          userRequest1.password,
          'random2',
        ),
        entityBuilder.createUser(
          userRequest3.email,
          userRequest3.password,
          'random3',
        ),
      ),
    );

    const role = await entityBuilder.createRole(RoleEnum.USER);
    const right = await entityBuilder.createRight(RightsEnum.CAN_READ_USERS);

    await entityBuilder.createRoleRight(role, right);
    await entityBuilder.createUserRole(users[0], role);

    const authTokenWithAuthority = (await sessionService.login(userRequest2))
      .token;
    const authTokenWithoutAuthority = (await sessionService.login(userRequest1))
      .token;

    return { authTokenWithAuthority, authTokenWithoutAuthority, users };
  };

  describe('GET - ' + API_URL, () => {
    it('expects 200 with users list sorted by email', async () => {
      const ctx = await validContext();
      const users = ctx.users;

      const response = await request(context.server)
        .get(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authTokenWithAuthority)
        .expect(HttpStatus.OK);

      expect(response.body).not.toBeUndefined();

      const usersResponse: DtoGetUsersResponse[] = response.body;
      expect(usersResponse.length).toEqual(users.length);

      users.sort((a, b) => a.email.localeCompare(b.email));

      for (let i = 0; i < users.length; i++) {
        expect(users[i].id).toEqual(usersResponse[i].id);
        expect(users[i].lastName).toEqual(usersResponse[i].lastName);
        expect(users[i].firstName).toEqual(usersResponse[i].firstName);
        expect(users[i].email).toEqual(usersResponse[i].email);
      }
    });

    it('expects 403 when user does not have rights', async () => {
      const ctx = await validContext();

      await request(context.server)
        .get(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authTokenWithoutAuthority)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
