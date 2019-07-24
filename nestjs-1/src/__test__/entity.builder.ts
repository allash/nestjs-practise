import { Connection, Repository } from 'typeorm';
import { DbUser } from '../module/db/entities/user.entity';
import { Inject } from '@nestjs/common';
import { DbConstants } from '../module/db/db.constants';
import * as bcrypt from 'bcrypt';

export default class EntityBuilder {

    public userRepo: Repository<DbUser>;

    constructor(@Inject(DbConstants.DB_CONNECTION) private readonly connection: Connection) {
        this.userRepo = this.connection.getRepository(DbUser);
    }

    public async createUser(email: string, password: string): Promise<DbUser> {
        const user = new DbUser();
        user.firstName = '';
        user.age = 1;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);
        return await this.userRepo.save(user);
    }

    public static async create(connection: Connection): Promise<EntityBuilder> {
        return new EntityBuilder(connection);
    }
}
