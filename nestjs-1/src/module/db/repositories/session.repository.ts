import { DbSession } from './../entities/session.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DbSession)
export class SessionRepository extends Repository<DbSession> {
    public async findOneByToken(token: string): Promise<DbSession | undefined> {
        return this.createQueryBuilder('s')
            .where('s.token = :token', { token })
            .getOne();
    }

    public async findAllWithSessions(): Promise<DbSession[]> {
        return this.createQueryBuilder('s')
            .leftJoinAndSelect('s.user', 'user')
            .orderBy('s.createdAt', 'DESC')
            .getMany();
    }
}
