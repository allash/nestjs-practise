import { DbSession } from './../entities/session.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DbSession)
export class SessionRepository extends Repository<DbSession> {
    public async findOneByToken(token: string): Promise<DbSession> {
        return this.createQueryBuilder('s')
            .where('s.token = :token', { token })
            .getOne();
    }
}
