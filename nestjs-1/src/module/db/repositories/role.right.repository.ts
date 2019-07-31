import { DbRoleRight } from './../entities/role.right.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(DbRoleRight)
export class RoleRightRepository extends Repository<DbRoleRight> { }
