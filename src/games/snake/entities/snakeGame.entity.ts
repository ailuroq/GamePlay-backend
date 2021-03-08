import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../user/user.entity';

@Entity()
export class SnakeGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maxScore: number;

  @Column()
  lastScore: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
