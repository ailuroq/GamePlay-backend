import { User } from '../entities/user.entity';

export class UsersSubscribersRo {
  subscribers: User[];
  page: number;
  limit: number;
  totalCount: number;
  numberOfPages: number;
}
