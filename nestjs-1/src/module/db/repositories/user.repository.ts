import { DbUser } from '../entities/user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { keysToCamel } from '../../../config/utils';
import * as _ from 'lodash';

@EntityRepository(DbUser)
export class UserRepository extends Repository<DbUser> {
  public async findOneByEmail(email: string): Promise<DbUser | undefined> {
    return this.createQueryBuilder('u')
      .where('u.email = :email', { email })
      .getOne();
  }

  public async findUserWithGrantedAuthorities(
    id: string,
  ): Promise<DbUser | undefined> {
    const result = await this.createQueryBuilder('u')
      .select(['u.id', 'u.email'])
      .leftJoinAndSelect('u.userRoles', 'ur')
      .leftJoinAndSelect('ur.role', 'r')
      .leftJoinAndSelect('r.roleRights', 'rr')
      .leftJoinAndSelect('rr.right', 'right')
      .where('u.id = :id', { id })
      .getOne();

    return result;
  }

  public async findUserGrantedAuthoritiesRaw(id: string): Promise<any[]> {
    return this.createQueryBuilder('user')
      .select(['user.id', 'user.email', 'role.name', 'right.name'])
      .innerJoin('user.userRoles', 'userRole')
      .innerJoin('userRole.role', 'role')
      .innerJoin('role.roleRights', 'roleRights')
      .innerJoin('roleRights.right', 'right')
      .where('user.id = :id', { id })
      .getRawMany();
  }

  public async findMappedUserGrantedAuthorities(id: string): Promise<DtoUserRole[]> {
    const result = await this.findUserGrantedAuthoritiesRaw(id);

    const userRoles: DtoUserRole[] = keysToCamel(result);

    // const groupedOmit = _.mapValues(_.groupBy(userRoles, 'userId'), list =>
    //   list.map(userRole => _.omit(userRole, 'userId')),
    // );

    return userRoles;
  }
}

export interface DtoUserRole {
  userId: string;
  userEmail: string;
  roleName: string;
  rightName: string;
}
