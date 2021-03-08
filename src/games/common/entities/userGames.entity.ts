import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../../user/user.entity';
import { CommonGameInfo } from './commonGameInfo.entity';

@Entity()
export class UserGames {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userGames)
  user: User;

  @ManyToOne(() => CommonGameInfo, (commonGameInfo) => commonGameInfo.userGames)
  game: CommonGameInfo;

  @Column({ type: 'timestamp' })
  lastGameVisitTime: Date;

  @Column()
  favoriteGame: boolean;
}
