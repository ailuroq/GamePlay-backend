import { Module } from '@nestjs/common';
import { SnakeGameModule } from './snake/snakeGame.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonGameInfo } from './common/entities/commonGameInfo.entity';
import { UserGames } from './common/entities/userGames.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommonGameInfo, UserGames]),
    SnakeGameModule,
  ],
  exports: [TypeOrmModule],
})
export class GamesModule {}
