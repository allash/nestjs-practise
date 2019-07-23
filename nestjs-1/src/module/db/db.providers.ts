import { SessionRepository } from './repositories/session.repository';
import { UserRepository } from './repositories/user.repository';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DbConstants } from './db.constants';

export const DbProviders = [
  {
    provide: DbConstants.USER_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(UserRepository),
    inject: [DbConstants.DB_CONNECTION],
  },
  {
    provide: DbConstants.SESSION_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(SessionRepository),
    inject: [DbConstants.DB_CONNECTION],
  },
  {
    provide: DbConstants.DB_CONNECTION,
    useFactory: async () => {
      const options = (await getConnectionOptions()) as PostgresConnectionOptions;
      const connection = await createConnection(options);
      return connection;
    },
  },
];
