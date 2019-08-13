import { DbRoleRight } from './role.right.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('right')
export class DbRight {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'name' })
  public name: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  public createdAt: Date;

  @OneToMany(() => DbRoleRight, roleRight => roleRight.right)
  public roleRights: DbRoleRight[];
}
