import { SnakeGame } from '../entities/snakeGame.entity';

export class PaginatedUserTableResultDto {
  data: SnakeGame[];
  page: number;
  limit: number;
  totalCount: number;
  numberOfPages?: number;
}
