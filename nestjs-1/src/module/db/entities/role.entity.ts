import { DbUserRole } from './user.role.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { DbRoleRight } from './role.right.entity';

@Entity('role')
export class DbRole {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ name: 'name' })
    public name: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz'
    })
    public createdAt: Date;

    @OneToMany(() => DbUserRole, (userRole) => userRole.role)
    public userRoles: DbUserRole[];

    @OneToMany(() => DbRoleRight, (roleRight) => roleRight.role)
    public roleRights: DbRoleRight[];
}
