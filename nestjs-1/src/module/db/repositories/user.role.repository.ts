import { DbUserRole } from './../entities/user.role.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(DbUserRole)
export class UserRoleRepository extends Repository<DbUserRole> { }
