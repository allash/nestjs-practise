import { DbRole } from './role.entity';
import {
  Entity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { DbRight } from './right.entity';

@Entity('role_right')
export class DbRoleRight {
  @PrimaryColumn()
  public rightId: string;

  @PrimaryColumn()
  public roleId: string;

  @ManyToOne(() => DbRight)
  @JoinColumn()
  public right: DbRight;

  @ManyToOne(() => DbRole)
  @JoinColumn()
  public role: DbRole;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  public createdAt: Date;
}
