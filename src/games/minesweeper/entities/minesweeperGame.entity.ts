import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../user/entities/user.entity';

@Entity()
export class MinesweeperGameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  maxScore: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
