import { HttpStatus } from '@nestjs/common';
import { AppConstants } from './../../../config/constants';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import EntityBuilder from '../../../__test__/entity.builder';
import { recreateSchema } from '../../../__test__';
import * as request from 'supertest';
import { DtoGetUsersResponse } from '../dto/response/dto.get.users.response';
import { DbUser } from '../../db/entities/user.entity';
import { DbSession } from '../../db/entities/session.entity';
import { RoleEnum } from '../../../config/role.enum';
import { RightsEnum } from '../../../config/rights.enum';

describe('User Controller', () => {
  let context: TestContext;

  let entityBuilder: EntityBuilder;

  const API_URL = `/${AppConstants.API_PREFIX}/users`;

  beforeAll(async () => {
    context = await getContext(true);
  });

  beforeEach(async () => {
    await Promise.all([recreateSchema(context.connection)]);
    entityBuilder = await EntityBuilder.create(context.connection);
  });

  afterAll(async () => {
    await context.tearDown();
  });

  class AuthContext {
    sessionWithAuthority: DbSession;
    sessionWithoutAuthority: DbSession;
    users: DbUser[];
  }

  const validContext = async (): Promise<AuthContext> => {
    const users = await Promise.all(
      new Array(
        entityBuilder.createUser('user2@mail.com', '12345', 'random1', 30),
        entityBuilder.createUser('user1@mail.com', '12345', 'random2', 40),
        entityBuilder.createUser('user3@mail.com', '12345', 'random3', 50),
      ),
    );

    const role = await entityBuilder.createRole(RoleEnum.USER);
    const right = await entityBuilder.createRight(RightsEnum.CAN_READ_USERS);

    await entityBuilder.createRoleRight(role, right);
    await entityBuilder.createUserRole(users[0], role);

    const sessionWithAuthority = await entityBuilder.createSession(users[0]);
    const sessionWithoutAuthority = await entityBuilder.createSession(users[1]);

    return { sessionWithAuthority, sessionWithoutAuthority, users };
  };

  describe('GET - ' + API_URL, () => {
    it('expects 200 with users list sorted by email', async () => {
      const ctx = await validContext();
      const users = ctx.users;

      const response = await request(context.server)
        .get(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.sessionWithAuthority.token)
        .expect(HttpStatus.OK);

      expect(response.body).not.toBeUndefined();

      const usersResponse: DtoGetUsersResponse[] = response.body;
      expect(usersResponse.length).toEqual(users.length);

      users.sort((a, b) => a.email.localeCompare(b.email));

      for (let i = 0; i < users.length; i++) {
        expect(users[i].id).toEqual(usersResponse[i].id);
        expect(users[i].age).toEqual(usersResponse[i].age);
        expect(users[i].firstName).toEqual(usersResponse[i].firstName);
        expect(users[i].email).toEqual(usersResponse[i].email);
      }
    });

    it('expects 403 when user does not have rights', async () => {
      const ctx = await validContext();

      await request(context.server)
        .get(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.sessionWithoutAuthority.token)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
