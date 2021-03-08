import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserGames } from '../games/common/entities/userGames.entity';

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

  @Column()
  avatarName: string;

  @OneToMany(() => UserGames, (userGames) => userGames.user)
  userGames: UserGames[];
}
