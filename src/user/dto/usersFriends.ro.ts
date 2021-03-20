import { User } from '../entities/user.entity';

export class UsersFriendsRo {
  friends: User[];
  page: number;
  limit: number;
  totalCount: number;
  numberOfPages: number;
}
