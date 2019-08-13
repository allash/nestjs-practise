import { SessionService } from './../../session/session.service';
import { flushRedis } from './../../../__test__/utilities';
import { RightsEnum } from '../../../config/rights.enum';
import { DtoCreateInvoiceRequest } from '../dto/request/dto.create.invoice.request';
import { HttpStatus, Logger } from '@nestjs/common';
import { DbUser } from '../../db/entities/user.entity';
import { recreateSchema } from '../../../__test__/utilities';
import { AppConstants } from '../../../config/constants';
import { TestContext, getContext } from '../../../__e2e__/test.context';
import EntityBuilder from '../../../__test__/entity.builder';
import * as request from 'supertest';
import { RoleEnum } from '../../../config/role.enum';
import wait from '../../../__test__/wait';
import { SessionModule } from '../../session/session.module';

describe.skip('JEST_WORKER_ID_TEST_2', () => {
  let context: TestContext;
  let entityBuilder: EntityBuilder;
  const logger = new Logger('JEST_WORKER_ID_TEST_2');
  const WAIT_TIME = 10000;

  let sessionService: SessionService;

  const API_URL = `/${AppConstants.API_PREFIX}/invoices`;

  beforeAll(async () => {
    context = await getContext(true);
    sessionService = await context.app
      .select(SessionModule)
      .get<SessionService>(SessionService);
  });

  beforeEach(async () => {
    jest.setTimeout(WAIT_TIME + 1000);

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
    body: DtoCreateInvoiceRequest;
  }

  const validContext = async (): Promise<AuthContext> => {
    const loginRequest = { email: 'test@mail.com', password: '12345' };

    const user = await entityBuilder.createUser(
      loginRequest.email,
      loginRequest.password,
    );

    const authToken = (await sessionService.login(loginRequest)).token;

    const body: DtoCreateInvoiceRequest = {
      priceGross: Math.random() * 1000 + 1,
    };

    const role = await entityBuilder.createRole(RoleEnum.ADMIN);
    const right = await entityBuilder.createRight(
      RightsEnum.CAN_CREATE_INVOICE,
    );

    await entityBuilder.createRoleRight(role, right);
    await entityBuilder.createUserRole(user, role);

    return { user, authToken, body };
  };

  describe('1 POST - ' + API_URL, () => {
    it('expects 201 with created invoice 1', async () => {
      logger.debug('WORKER_ID: ' + process.env.JEST_WORKER_ID);
      const ctx = await validContext();

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .send(ctx.body)
        .expect(HttpStatus.CREATED);

      await wait(WAIT_TIME);

      const invoices = await entityBuilder.invoiceRepo.find();
      const invoice = invoices[0];

      expect(invoice).toBeDefined();
      expect(invoice!!.priceGross).toBeCloseTo(ctx.body.priceGross, 7);
      expect(invoice!!.userId).toEqual(ctx.user.id);
    });

    it('expects 201 with created invoice 2', async () => {
      logger.debug('WORKER_ID: ' + process.env.JEST_WORKER_ID);
      const ctx = await validContext();

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .send(ctx.body)
        .expect(HttpStatus.CREATED);

      await wait(WAIT_TIME);

      const invoices = await entityBuilder.invoiceRepo.find();
      const invoice = invoices[0];

      expect(invoice).toBeDefined();
      expect(invoice!!.priceGross).toBeCloseTo(ctx.body.priceGross, 7);
      expect(invoice!!.userId).toEqual(ctx.user.id);
    });
  });

  describe('2 POST - ' + API_URL, () => {
    it('expects 201 with created invoice 1', async () => {
      logger.debug('WORKER_ID: ' + process.env.JEST_WORKER_ID);
      const ctx = await validContext();

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .send(ctx.body)
        .expect(HttpStatus.CREATED);

      await wait(WAIT_TIME);

      const invoices = await entityBuilder.invoiceRepo.find();
      const invoice = invoices[0];

      expect(invoice).toBeDefined();
      expect(invoice!!.priceGross).toBeCloseTo(ctx.body.priceGross, 7);
      expect(invoice!!.userId).toEqual(ctx.user.id);
    });

    it('expects 201 with created invoice 2', async () => {
      logger.debug('WORKER_ID: ' + process.env.JEST_WORKER_ID);
      const ctx = await validContext();

      await request(context.server)
        .post(API_URL)
        .set(AppConstants.X_AUTH_TOKEN, ctx.authToken)
        .send(ctx.body)
        .expect(HttpStatus.CREATED);

      await wait(WAIT_TIME);

      const invoices = await entityBuilder.invoiceRepo.find();
      const invoice = invoices[0];

      expect(invoice).toBeDefined();
      expect(invoice!!.priceGross).toBeCloseTo(ctx.body.priceGross, 7);
      expect(invoice!!.userId).toEqual(ctx.user.id);
    });
  });
});
