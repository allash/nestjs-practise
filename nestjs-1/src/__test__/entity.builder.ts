import { DbInvoice } from './../module/db/entities/invoice.entity';
import { Connection, Repository } from 'typeorm';
import { DbUser } from '../module/db/entities/user.entity';
import { Inject } from '@nestjs/common';
import { DbConstants } from '../module/db/db.constants';
import * as bcrypt from 'bcrypt';
import { DbRole } from '../module/db/entities/role.entity';
import { DbUserRole } from '../module/db/entities/user.role.entity';
import { DbRoleRight } from '../module/db/entities/role.right.entity';
import { DbRight } from '../module/db/entities/right.entity';
import uuid = require('uuid');
import { DbUserFile } from '../module/db/entities/user.file.entity';

export default class EntityBuilder {
  public userRepo: Repository<DbUser>;
  public roleRepo: Repository<DbRole>;
  public userRoleRepo: Repository<DbUserRole>;
  public rightRepo: Repository<DbRight>;
  public roleRightRepo: Repository<DbRoleRight>;
  public invoiceRepo: Repository<DbInvoice>;
  public userFileRepo: Repository<DbUserFile>;

  constructor(
    @Inject(DbConstants.DB_CONNECTION) private readonly connection: Connection
  ) {
    this.userRepo = this.connection.getRepository(DbUser);
    this.roleRepo = this.connection.getRepository(DbRole);
    this.userRoleRepo = this.connection.getRepository(DbUserRole);
    this.rightRepo = this.connection.getRepository(DbRight);
    this.roleRightRepo = this.connection.getRepository(DbRoleRight);
    this.invoiceRepo = this.connection.getRepository(DbInvoice);
    this.userFileRepo = this.connection.getRepository(DbUserFile);
  }

  public async createUser(
    email: string,
    password: string,
    firstName: string = uuid.v4().toString(),
    lastName: string = uuid.v4().toString(),
    phone: string = '123456789',
  ): Promise<DbUser> {
    const user = new DbUser();
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    return await this.userRepo.save(user);
  }

  public async createRole(name: string): Promise<DbRole> {
    const role = new DbRole();
    role.name = name;
    return await this.roleRepo.save(role);
  }

  public async createUserRole(user: DbUser, role: DbRole): Promise<DbUserRole> {
    const userRole = new DbUserRole();
    userRole.user = user;
    userRole.userId = user.id;
    userRole.role = role;
    userRole.roleId = role.id;
    return await this.userRoleRepo.save(userRole);
  }

  public async createRight(name: string): Promise<DbRight> {
    const right = new DbRight();
    right.name = name;
    return await this.rightRepo.save(right);
  }

  public async createRoleRight(
    role: DbRole,
    right: DbRight,
  ): Promise<DbRoleRight> {
    const roleRight = new DbRoleRight();
    roleRight.role = role;
    roleRight.roleId = role.id;
    roleRight.right = right;
    roleRight.rightId = right.id;
    return await this.roleRightRepo.save(roleRight);
  }

  public async createInvoice(
    user: DbUser,
    priceGross: number = 100,
  ): Promise<DbInvoice> {
    const invoice = new DbInvoice();
    invoice.priceGross = priceGross;
    invoice.user = user;
    invoice.userId = user.id;
    return await this.invoiceRepo.save(invoice);
  }

  public static async create(connection: Connection): Promise<EntityBuilder> {
    return new EntityBuilder(connection);
  }
}
