import { AppModule } from './../module/app/app.module';
import { DbConstants } from './../module/db/db.constants';
import { DbModule } from './../module/db/db.module';
import { SessionModule } from './../module/session/session.module';
import { UserModule } from './../module/user/user.module';
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import * as express from 'express';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

class TestContext {

    public server: Express.Application = express();
    public app: INestApplication;
    public connection: Connection;

    public async init() {
        const testModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(),
                UserModule,
                SessionModule,
                DbModule
            ]
        })
        .compile();

        const expressAdapter = new ExpressAdapter(this.server);
        this.app = testModule.createNestApplication(expressAdapter);

        await this.app.init();

        this.connection = await this.app.select(DbModule).get<Connection>(DbConstants.DB_CONNECTION);

        if (this.connection == null) {
            throw new Error('TestModule.init(): cannot establish database connection');
          }
    }

    public async tearDown() {
        if (this.connection) { await this.connection.close(); }
        if (this.app) { await this.app.close(); }
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
