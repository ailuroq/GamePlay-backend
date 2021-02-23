import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Image } from './image.entity';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ length: 50 })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Image)
  @JoinColumn()
  avatar: Image;
}
