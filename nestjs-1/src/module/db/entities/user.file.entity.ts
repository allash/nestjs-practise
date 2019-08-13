import { DbUser } from './user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('user_file')
export class DbUserFile {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public originalName: string;

  @Column()
  public size: number;

  @Column()
  public mimeType: string;

  @Column({
    name: 'user_id',
    nullable: false,
  })
  public userId: string;

  @ManyToOne(() => DbUser, user => user.userFiles)
  @JoinColumn({
    name: 'user_id',
  })
  public user: DbUser;
}
