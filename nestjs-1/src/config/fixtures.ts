import { RoleEnum } from './role.enum';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Logger } from '@nestjs/common';
import * as fakerStatic from 'faker';
import { Connection, Transaction } from 'typeorm';
import EntityBuilder from '../__test__/entity.builder';
import { RightsEnum } from './rights.enum';
import { RedisService } from '../module/redis/redis.service';
import uuid = require('uuid');

export class Fixtures {

  private logger = new Logger(Fixtures.name);

  private async rebuildDatabases(connection: Connection, redisService: RedisService) {
    this.logger.warn('Erasing postgres database and loading fixtures...');

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

    this.logger.warn('Erasing redis db and loading fixtures...');

    const redisFlushResult = await redisService.flush();

    this.logger.warn(`Redis flush result: ${redisFlushResult}`);
  }

  private async loadFixtures(connection: Connection, redisService: RedisService) {

    const builder = await EntityBuilder.create(connection);

    // init rights
    const canReadUsersRight = await builder.createRight(RightsEnum.CAN_READ_USERS);
    const canCreateUserRight = await builder.createRight(RightsEnum.CAN_CREATE_USER);
    const canEditUserRight = await builder.createRight(RightsEnum.CAN_EDIT_USER);

    const canDoRandomStuffRight = await builder.createRight(RightsEnum.CAN_DO_RANDOM_STUFF);
    const canCreateTicketRight = await builder.createRight(RightsEnum.CAN_CREATE_TICKET);
    const canUploadUserFileRight = await builder.createRight(RightsEnum.CAN_UPLOAD_USER_FILES);

    // init roles and assign to rights
    const adminRole = await builder.createRole(RoleEnum.ADMIN);
    await builder.createRoleRight(adminRole, canReadUsersRight);
    await builder.createRoleRight(adminRole, canCreateUserRight);
    await builder.createRoleRight(adminRole, canEditUserRight);

    const randomRole = await builder.createRole(RoleEnum.RANDOM);
    await builder.createRoleRight(randomRole, canDoRandomStuffRight);

    const roleWithoutRights = await builder.createRole(RoleEnum.EMPTY);

    const userRole = await builder.createRole(RoleEnum.USER);
    await builder.createRoleRight(userRole, canCreateTicketRight);
    await builder.createRoleRight(userRole, canUploadUserFileRight);

    // init users with roles
    const superAdmin = await builder.createUser('superadmin@email.com', 'asdf', 'SuperAdmin');
    await builder.createUserRole(superAdmin, adminRole);
    await builder.createUserRole(superAdmin, randomRole);
    await builder.createUserRole(superAdmin, userRole);

    const admin = await builder.createUser('admin@mail.com', 'asdf', 'Admin');
    await builder.createUserRole(admin, adminRole);

    const user = await builder.createUser('user@mail.com', 'asdf', 'User');
    await builder.createUserRole(user, userRole);

    const userWithoutAnyRole = await builder.createUser('user-without-role@mail.com', 'asdf', 'UserWithoutRole');

    const userWithEmptyRole = await builder.createUser('user-empty-role@mail.com', 'asdf', 'UserWithEmptyRole');
    await builder.createUserRole(userWithEmptyRole, roleWithoutRights);

    // create invoices
    for (let i = 0; i < 10; i++) {
      await builder.createInvoice(admin, i * 10);
    }

    await redisService.set(uuid.v4(), superAdmin.id);
    await redisService.set(uuid.v4(), admin.id);
    await redisService.set(uuid.v4(), user.id);
    await redisService.set(uuid.v4(), userWithoutAnyRole.id);
    await redisService.set(uuid.v4(), userWithEmptyRole.id);

    // create fake users

    for (let i = 0; i < 200; i++) {
      const firstName = fakerStatic.name.firstName();
      const lastName = fakerStatic.name.lastName();
      const email = `${firstName}.${lastName}${i}@mail.com`.toLowerCase();
      const phone = fakerStatic.phone.phoneNumber();
      await builder.createUser(email, 'asdf', firstName, lastName, phone);
    }
  }

  async run(connection: Connection, redisService: RedisService) {

    if (process.env.NODE_ENV !== 'dev') {
        this.logger.error('fixtures: NODE_ENV is not development');
        throw Error('fixtures(): NODE_ENV is not development',
        );
      }

    await this.rebuildDatabases(connection, redisService);
    await this.loadFixtures(connection, redisService);
  }
}
