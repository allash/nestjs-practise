import { RoleEnum } from './role.enum';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Logger } from '@nestjs/common';
import { Connection } from 'typeorm';
import EntityBuilder from '../__test__/entity.builder';
import { RightsEnum } from './rights.enum';

export class Fixtures {

  private logger = new Logger(Fixtures.name);

  private async rebuildDatabase(connection: Connection) {
    this.logger.warn('Erasing database and loading fixtures');

    const schema = (connection.options as PostgresConnectionOptions).schema;

    this.logger.warn('Generating drop statements');

    const generateDropStatements = `
          select 'drop table if exists "' || tablename || '" cascade;'
          from pg_tables
          where schemaname = '${schema}';
        `;

    const result = await connection.query(generateDropStatements);
    const dropQuery = result.map((x: any) => x['?column?']).join('\n');

    this.logger.warn('Dropping tables');

    await connection.query(dropQuery);

    this.logger.log('Synchronizing entities');

    await connection.runMigrations();
  }

  private async loadFixtures(connection: Connection) {

    const builder = await EntityBuilder.create(connection);

    // init rights
    const canReadUsersRight = await builder.createRight(RightsEnum.CAN_READ_USERS);
    const canCreateUserRight = await builder.createRight(RightsEnum.CAN_CREATE_USER);
    const canEditUserRight = await builder.createRight(RightsEnum.CAN_EDIT_USER);

    const canDoRandomStuffRight = await builder.createRight(RightsEnum.CAN_DO_RANDOM_STUFF);
    const canCreateTicketRight = await builder.createRight(RightsEnum.CAN_CREATE_TICKET);

    // init roles and assign to rights
    const adminRole = await builder.createRole(RoleEnum.ADMIN);
    await builder.createRoleRight(adminRole, canReadUsersRight);
    await builder.createRoleRight(adminRole, canCreateUserRight);
    await builder.createRoleRight(adminRole, canEditUserRight);

    const randomRole = await builder.createRole(RoleEnum.RANDOM);
    await builder.createRoleRight(randomRole, canDoRandomStuffRight);

    const roleWithoutRights = await builder.createRole(RoleEnum.EMPTY);

    const userRole = await builder.createRole('USER');
    await builder.createRoleRight(userRole, canCreateTicketRight);

    // init users with roles
    const superAdmin = await builder.createUser('superadmin@email.com', '1234', 'SuperAdmin');
    await builder.createUserRole(superAdmin, adminRole);
    await builder.createUserRole(superAdmin, randomRole);
    await builder.createUserRole(superAdmin, userRole);

    const admin = await builder.createUser('admin@mail.com', '1234', 'Admin');
    await builder.createUserRole(admin, adminRole);

    const user = await builder.createUser('user@mail.com', '1234', 'User');
    await builder.createUserRole(user, userRole);

    const userWithoutAnyRole = await builder.createUser('user-without-role@mail.com', '1234', 'UserWithoutRole');

    const userWithEmptyRole = await builder.createUser('user-empty-role@mail.com', '1234', 'UserWithEmptyRole');
    await builder.createUserRole(userWithEmptyRole, roleWithoutRights);

    // create invoices
    for (let i = 0; i < 10; i++) {
      await builder.createInvoice(admin, i * 10);
    }

    // create sessions
    await builder.createSession(superAdmin);
    await builder.createSession(admin);
    await builder.createSession(user);
    await builder.createSession(userWithoutAnyRole);
    await builder.createSession(userWithEmptyRole);
  }

  async run(connection: Connection) {

    if (process.env.NODE_ENV !== 'dev') {
        this.logger.error('fixtures: NODE_ENV is not development');
        throw Error('fixtures(): NODE_ENV is not development',
        );
      }

    await this.rebuildDatabase(connection);
    await this.loadFixtures(connection);
  }
}
