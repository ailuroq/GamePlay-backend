import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeGame } from './entities/snakeGame.entity';
import { SnakeGameService } from './services/snakeGame.service';
import { SnakeGameController } from './controllers/snakeGame.controller';
import { UserModule } from '../../user/user.module';
import { User } from '../../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SnakeGame])],
  providers: [SnakeGameService],
  controllers: [SnakeGameController],
  exports: [SnakeGameService, TypeOrmModule],
})
export class SnakeGameModule {}
