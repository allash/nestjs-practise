import { Connection, Repository } from 'typeorm';
import { DbUser } from '../module/db/entities/user.entity';
import { Inject } from '@nestjs/common';
import { DbConstants } from '../module/db/db.constants';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { DbSession } from '../module/db/entities/session.entity';
import { DbRole } from '../module/db/entities/role.entity';
import { DbUserRole } from '../module/db/entities/user.role.entity';
import { DbRoleRight } from '../module/db/entities/role.right.entity';
import { DbRight } from '../module/db/entities/right.entity';

export default class EntityBuilder {

    public userRepo: Repository<DbUser>;
    public sessionRepo: Repository<DbSession>;
    public roleRepo: Repository<DbRole>;
    public userRoleRepo: Repository<DbUserRole>;
    public rightRepo: Repository<DbRight>;
    public roleRightRepo: Repository<DbRoleRight>;

    constructor(@Inject(DbConstants.DB_CONNECTION) private readonly connection: Connection) {
        this.userRepo = this.connection.getRepository(DbUser);
        this.sessionRepo = this.connection.getRepository(DbSession);
        this.roleRepo = this.connection.getRepository(DbRole);
        this.userRoleRepo = this.connection.getRepository(DbUserRole);
        this.rightRepo = this.connection.getRepository(DbRight);
        this.roleRightRepo = this.connection.getRepository(DbRoleRight);
    }

    public async createUser(email: string, password: string, firstName: string = 'random', age: number = 99): Promise<DbUser> {
        const user = new DbUser();
        user.firstName = firstName;
        user.age = age;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);
        return await this.userRepo.save(user);
    }

    public async createSession(user: DbUser): Promise<DbSession> {
        const session = new DbSession();
        session.token = uuid.v4();
        session.user = user;
        session.userId = user.id;
        return await this.sessionRepo.save(session);
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

    public async createRoleRight(role: DbRole, right: DbRight): Promise<DbRoleRight> {
        const roleRight = new DbRoleRight();
        roleRight.role = role;
        roleRight.roleId = role.id;
        roleRight.right = right;
        roleRight.rightId = right.id;
        return await this.roleRightRepo.save(roleRight);
    }

    public static async create(connection: Connection): Promise<EntityBuilder> {
        return new EntityBuilder(connection);
    }
}
