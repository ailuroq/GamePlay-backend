import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { UserRO } from '../dto/users.ro';
import { UserGames } from '../../games/common/entities/userGames.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( {unique: true })
  username: string;

  @Column({ length: 50 })
  email: string;

  @Column()
  password: string;

  @Column()
  avatarName: string;

  @ManyToMany((type) => User, { cascade: true })
  @JoinTable()
  subscribers: User[];

  @ManyToMany((type) => User, { cascade: true })
  @JoinTable()
  friends: User[];

  toResponseObject(showPassword = true): UserRO {
    const { id, username, email, avatarName, password } = this;
    const responseObject: any = { id, username, email, avatarName };
    if (showPassword) {
      responseObject.password = password;
    }
    if (this.subscribers) {
      responseObject.subscribers = this.subscribers;
    }
    if (this.friends) {
      responseObject.friends = this.friends;
    }
    return responseObject;
  }

  toResponseObjectCurrentUser(showPassword = true): UserRO {
    const { id, username, email, avatarName, password } = this;
    const responseObject: any = { id, username, email, avatarName };
    if (showPassword) {
      responseObject.password = password;
      responseObject.subscribers = this.subscribers;
      responseObject.friends = this.friends;
    }
    return responseObject;
  }

  @OneToMany(() => UserGames, (userGames) => userGames.user)
  userGames: UserGames[];
}
