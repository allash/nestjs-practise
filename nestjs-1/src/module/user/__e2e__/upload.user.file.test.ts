import { UserModule } from './../user.module';
import * as path from 'path';
import { RightsEnum } from './../../../config/rights.enum';
import { RoleEnum } from './../../../config/role.enum';
import { DbUser } from './../../db/entities/user.entity';
import { SessionModule } from './../../session/session.module';
import { flushRedis } from './../../../__test__/utilities';
import { AppConstants } from './../../../config/constants';
import { HttpStatus } from '@nestjs/common';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import EntityBuilder from '../../../__test__/entity.builder';
import { recreateSchema } from '../../../__test__';
import * as request from 'supertest';
import { SessionService } from '../../session/session.service';
import { S3Service } from '../../../utils/s3.service';

describe('User controller', () => {
  let context: TestContext;

  let entityBuilder: EntityBuilder;

  let sessionService: SessionService;

  let s3Service: S3Service;

  const API_URL = `/${AppConstants.API_PREFIX}/users/files/upload`;

  beforeAll(async () => {
    context = await getContext(true);
    sessionService = context.app
      .select(SessionModule)
      .get<SessionService>(SessionService);
    s3Service = context.app.select(UserModule).get<S3Service>(S3Service);
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
  }

  const validContext = async (): Promise<AuthContext> => {
    const userRequest = { email: 'test@mail.com', password: '1234' };

    const user = await entityBuilder.createUser(
      userRequest.email,
      userRequest.password,
    );

    const authToken = (await sessionService.login(userRequest)).token;

    const role = await entityBuilder.createRole(RoleEnum.USER);
    const right = await entityBuilder.createRight(
      RightsEnum.CAN_UPLOAD_USER_FILES,
    );

    await entityBuilder.createRoleRight(role, right);
    await entityBuilder.createUserRole(user, role);

    return { user, authToken };
  };

  describe('POST - ' + API_URL, () => {
    const filesDir = path.resolve(path.join(__dirname, 'files'));
    it('expects 200 with user file uploaded', async () => {
      const ctx = await validContext();

      const userFilesBefore = await entityBuilder.userFileRepo.find();
      expect(userFilesBefore.length).toEqual(0);

      const fileName = 'derp.png';

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .attach('file', `${filesDir}/${fileName}`)
        .expect(HttpStatus.OK);

      const userFilesAfter = await entityBuilder.userFileRepo.find();
      expect(userFilesAfter.length).toEqual(1);
      expect(userFilesAfter[0].originalName).toEqual(fileName);

      const file = await s3Service.getObject(fileName);
      expect(file).toBeDefined();
      expect(file.ContentType).toEqual('image/png');
      expect(file.ContentLength).toEqual(userFilesAfter[0].size);
    });
  });
});
