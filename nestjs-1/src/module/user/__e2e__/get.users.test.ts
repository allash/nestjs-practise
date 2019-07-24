import { UserModule } from './../user.module';
import { UserService } from './../user.service';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import EntityBuilder from '../../../__test__/entity.builder';
import { recreateSchema } from '../../../__test__';
import * as request from 'supertest';

describe('User Controller', () => {
  let context: TestContext;

  let userService: UserService;

  let entityBuilder: EntityBuilder;

  const API_URL = '/users';

  beforeAll(async () => {
    context = await getContext(true);
    userService = await context.app
      .select(UserModule)
      .get<UserService>(UserService);
  });

  beforeEach(async () => {
    await Promise.all([recreateSchema(context.connection)]);
    entityBuilder = await EntityBuilder.create(context.connection);
  });

  afterAll(async () => {
    await context.tearDown();
  });

  describe('GET - ' + API_URL, () => {
    it('expects 200 with users list', async () => {
      const user1 = await entityBuilder.createUser('user1@mail.com', '12345');
      const user2 = await entityBuilder.createUser('user2@mail.com', '12345');
      const user3 = await entityBuilder.createUser('user3@mail.com', '12345');
      const users = new Array(user1, user2, user3);

      const response = await request(context.server)
        .get(API_URL)
        .expect(200);

      expect(response.body).not.toBeUndefined();



    });
  });
});
