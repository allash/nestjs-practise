import { DbRight } from './../entities/right.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DbRight)
export class RightRepository extends Repository<DbRight> { }
