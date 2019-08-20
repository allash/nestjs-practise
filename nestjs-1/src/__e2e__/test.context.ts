import { WsAdapter } from '@nestjs/platform-ws';
import { RedisConstants } from './../module/redis/redis.constants';
import { AppModule } from './../module/app/app.module';
import { DbConstants } from './../module/db/db.constants';
import { DbModule } from './../module/db/db.module';
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import * as express from 'express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { RedisModule } from '../module/redis/redis.module';
import { isDefined } from '../__test__/helper';

class TestContext {
  public server: Express.Application = express();
  public app: INestApplication;
  public connection: Connection;
  public redisClient: any;
  public redisSub: any;

  public async init() {
    const testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const expressAdapter = new ExpressAdapter(this.server);
    this.app = testModule.createNestApplication(expressAdapter);

    await this.app.useWebSocketAdapter(new WsAdapter(this.app) as any);

    await this.app.useGlobalPipes(new ValidationPipe()).init();

    this.redisClient = await this.app
      .select(RedisModule)
      .get(RedisConstants.REDIS_CONNECTION);

    this.redisSub = await this.app
      .select(RedisModule)
      .get(RedisConstants.REDIS_SUB_CONNECTION);

    this.connection = await this.app
      .select(DbModule)
      .get<Connection>(DbConstants.DB_CONNECTION);

    if (this.connection == null) {
      throw new Error(
        'TestModule.init(): cannot establish database connection',
      );
    }
  }

  public async tearDown() {
    if (isDefined(this.connection)) {
      await this.connection.close();
    }

    if (isDefined(this.app)) {
      await this.app.close();
    }

    if (isDefined(this.redisClient)) {
      await this.redisClient.quit();
    }

    if (isDefined(this.redisSub)) {
      await this.redisSub.quit();
    }
  }
}

let context: TestContext;

const getContext = async (reuse: boolean = false) => {
  if (reuse === true && context != null) {
    return context;
  }

  const newContext = new TestContext();
  await newContext.init();

  if (reuse === true) {
    context = newContext;
  }

  return newContext;
};

export { TestContext, getContext };
