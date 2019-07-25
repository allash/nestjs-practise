import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class DbUser {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ name: 'email', nullable: false, unique: true })
    public email: string;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'last_name' })
    public lastName: string;

    @Column({ name: 'password', nullable: false })
    public password: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        nullable: false
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz'
    })
    public updatedAt: Date;
}
