import { DbConstants } from './../db/db.constants';
import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { UserRepository } from '../db/repositories/user.repository';

@Injectable()
export class UserService {
    constructor(@Inject(DbConstants.USER_REPOSITORY) private readonly userRepo: UserRepository) { }

    async getUsers(): Promise<string> {
        const users = await this.userRepo.find();
        return 'users: ' + users.length;
    }
}
