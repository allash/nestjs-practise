import { DbRole } from './../entities/role.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DbRole)
export class RoleRepository extends Repository<DbRole> { }
