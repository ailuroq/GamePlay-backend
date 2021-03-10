import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../user/entities/user.entity';

@Entity()
export class SnakeGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  maxScore: number;

  @Column({ default: 0 })
  lastScore: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
