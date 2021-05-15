import { Module } from '@nestjs/common';
import { SnakeGameModule } from './snake/snakeGame.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonGameInfo } from './common/entities/commonGameInfo.entity';
import { UserGames } from './common/entities/userGames.entity';
import { MinesweeperGameModule } from './minesweeper/minesweeperGame.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommonGameInfo, UserGames]),
    SnakeGameModule,
    MinesweeperGameModule
  ],
  exports: [TypeOrmModule],
})
export class GamesModule {}
