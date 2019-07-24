import { Connection, Repository } from 'typeorm';
import { DbUser } from '../module/db/entities/user.entity';
import { Inject } from '@nestjs/common';
import { DbConstants } from '../module/db/db.constants';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { DbSession } from '../module/db/entities/session.entity';

export default class EntityBuilder {

    public userRepo: Repository<DbUser>;
    public sessionRepo: Repository<DbSession>;

    constructor(@Inject(DbConstants.DB_CONNECTION) private readonly connection: Connection) {
        this.userRepo = this.connection.getRepository(DbUser);
        this.sessionRepo = this.connection.getRepository(DbSession);
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

    public static async create(connection: Connection): Promise<EntityBuilder> {
        return new EntityBuilder(connection);
    }
}
