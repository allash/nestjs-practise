import { DbUserFile } from './../entities/user.file.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(DbUserFile)
export class UserFileRepository extends Repository<DbUserFile> { }
