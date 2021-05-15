import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { MinesweeperGameEntity } from './entities/minesweeperGame.entity';
import { MinesweeperGameService } from './services/minesweeperGame.service';
import { MinesweeperGameController } from './contrillers/minesweeperGame.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, MinesweeperGameEntity])],
  providers: [MinesweeperGameService],
  controllers: [MinesweeperGameController],
  exports: [MinesweeperGameService, TypeOrmModule],
})
export class MinesweeperGameModule {}
