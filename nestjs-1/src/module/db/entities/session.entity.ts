import { DbUser } from './user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('session')
export class DbSession {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ name: 'token' })
    public token: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz'
    })
    public createdAt: Date;

    @Column({
        name: 'user_id',
        nullable: false
    })
    public userId: string;

    @ManyToOne(() => DbUser, user => user.sessions)
    @JoinColumn({
        name: 'user_id'
      })
    public user: DbUser;
}
