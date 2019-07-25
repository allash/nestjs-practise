import { DbUser } from '../entities/user.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DbUser)
export class UserRepository extends Repository<DbUser> { }
