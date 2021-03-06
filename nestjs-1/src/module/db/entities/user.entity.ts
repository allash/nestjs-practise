import { DbInvoice } from './invoice.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { DbUserRole } from './user.role.entity';
import { DbUserFile } from './user.file.entity';

@Entity('user')
export class DbUser {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'first_name' })
  public firstName: string;

  @Column({ name: 'last_name' })
  public lastName: string;

  @Column({ name: 'phone', nullable: true })
  public phone: string;

  @Column({ name: 'email', nullable: false, unique: true })
  public email: string;

  @Column({ name: 'password', nullable: false })
  public password: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  public createdAt: Date;

  @OneToMany(() => DbInvoice, invoice => invoice.user)
  public invoices: DbInvoice[];

  @OneToMany(() => DbUserRole, userRole => userRole.user)
  public userRoles: DbUserRole[];

  @OneToMany(() => DbUserFile, userFile => userFile.user)
  public userFiles: DbUserFile[];
}
