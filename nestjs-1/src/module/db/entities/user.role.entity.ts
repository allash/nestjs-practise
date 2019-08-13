import { DbRole } from './role.entity';
import { DbUser } from './user.entity';
import {
  Entity,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';

@Entity('user_role')
export class DbUserRole {
  @PrimaryColumn()
  public userId: string;

  @PrimaryColumn()
  public roleId: string;

  @ManyToOne(() => DbUser)
  @JoinColumn()
  public user: DbUser;

  @ManyToOne(() => DbRole)
  @JoinColumn()
  public role: DbRole;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  public createdAt: Date;
}
