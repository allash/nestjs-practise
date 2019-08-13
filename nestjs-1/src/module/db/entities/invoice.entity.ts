import { DbUser } from './user.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Entity,
} from 'typeorm';

@Entity('invoice')
export class DbInvoice {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'price_gross', type: 'double precision' })
  public priceGross: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  public createdAt: Date;

  @Column({
    name: 'user_id',
    nullable: false,
  })
  public userId: string;

  @ManyToOne(() => DbUser, user => user.invoices)
  @JoinColumn({
    name: 'user_id',
  })
  public user: DbUser;
}
