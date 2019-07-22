import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity('user')
export class DbUser {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column()
    age: number;
}
