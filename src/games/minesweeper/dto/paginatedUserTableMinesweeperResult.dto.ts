import { MinesweeperGameEntity } from '../entities/minesweeperGame.entity';

export class PaginatedUserTableMinesweeperResultDto {
  data: MinesweeperGameEntity[];
  page: number;
  limit: number;
  totalCount: number;
  numberOfPages?: number;
}
