import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserGames } from './userGames.entity';

@Entity()
export class CommonGameInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameName: string;

  @Column()
  avatarPath: string;

  @Column()
  numberOfUsers: number;

  @OneToMany(() => UserGames, (userGames) => userGames.game)
  userGames: UserGames[];
}
