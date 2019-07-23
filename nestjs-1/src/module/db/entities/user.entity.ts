import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, OneToMany } from 'typeorm';
import { DbSession } from './session.entity';

@Entity('user')
export class DbUser {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'age' })
    public age: number;

    @Column({ name: 'email', nullable: false, unique: true })
    public email: string;

    @Column({ name: 'password', nullable: false })
    public password: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz'
    })
    public createdAt: Date;

    @OneToMany(() => DbSession, session => session.user)
    public sessions: DbSession[];
}
