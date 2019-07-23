import { DbUser } from '../entities/user.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DbUser)
export class UserRepository extends Repository<DbUser> {
    public async findOneByEmail(email: string): Promise<DbUser | undefined> {
        return this.createQueryBuilder('u')
            .where('u.email = :email', { email })
            .getOne();
    }
}
