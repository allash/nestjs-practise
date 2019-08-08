import { UserRoleRepository } from './repositories/user.role.repository';
import { UserRepository } from './repositories/user.repository';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DbConstants } from './db.constants';
import { RoleRepository } from './repositories/role.repository';
import { RightRepository } from './repositories/right.repository';
import { RoleRightRepository } from './repositories/role.right.repository';
import { InvoiceRepository } from './repositories/invoice.repository';

export const DbProviders = [
  {
    provide: DbConstants.USER_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(UserRepository),
    inject: [DbConstants.DB_CONNECTION],
  },
  {
    provide: DbConstants.USER_ROLE_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(UserRoleRepository),
    inject: [DbConstants.DB_CONNECTION],
  },
  {
    provide: DbConstants.ROLE_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(RoleRepository),
    inject: [DbConstants.DB_CONNECTION],
  },
  {
    provide: DbConstants.RIGHT_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(RightRepository),
    inject: [DbConstants.DB_CONNECTION],
  },
  {
    provide: DbConstants.ROLE_RIGHT_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(RoleRightRepository),
    inject: [DbConstants.DB_CONNECTION],
  },
  {
    provide: DbConstants.INVOICE_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.getCustomRepository(InvoiceRepository),
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
