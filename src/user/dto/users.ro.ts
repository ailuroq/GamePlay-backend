import { User } from '../entities/user.entity';

export class UserRO {
  id: number;
  username: string;
  email: string;
  avatarName: string;
  subscribers?: User[];
  friends?: User[];
  isFriend?: string;
}
