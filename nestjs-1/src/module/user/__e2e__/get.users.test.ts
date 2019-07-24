import { UserModule } from './../user.module';
import { UserService } from './../user.service';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import EntityBuilder from '../../../__test__/entity.builder';
import { recreateSchema } from '../../../__test__';
import * as request from 'supertest';
import { DtoGetUsersResponse } from '../dto/response/dto.get.users.response';

describe('User Controller', () => {
  let context: TestContext;

  let entityBuilder: EntityBuilder;

  const API_URL = '/users';

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

  describe('GET - ' + API_URL, () => {
    it('expects 200 with users list sorted by email', async () => {
      const users = await Promise.all(
        new Array(
          entityBuilder.createUser('user2@mail.com', '12345', 'random1', 30),
          entityBuilder.createUser('user1@mail.com', '12345', 'random2', 40),
          entityBuilder.createUser('user3@mail.com', '12345', 'random3', 50),
        ),
      );

      const response = await request(context.server)
        .get(API_URL)
        .expect(200);

      expect(response.body).not.toBeUndefined();

      const usersResponse: DtoGetUsersResponse[] = response.body;
      expect(usersResponse.length).toEqual(users.length);

      users.sort( (a, b) => a.email.localeCompare(b.email));

      for (let i = 0; i < users.length; i++) {
        expect(users[i].id).toEqual(usersResponse[i].id);
        expect(users[i].age).toEqual(usersResponse[i].age);
        expect(users[i].firstName).toEqual(usersResponse[i].firstName);
        expect(users[i].email).toEqual(usersResponse[i].email);
      }
    });
  });
});
