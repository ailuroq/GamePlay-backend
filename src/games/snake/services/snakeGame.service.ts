import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SnakeGame } from '../entities/snakeGame.entity';
import { getConnection, Repository } from 'typeorm';
import { SnakeGameResultDto } from '../dto/snakeGameResult.dto';
import { User } from '../../../user/user.entity';
import { USER_REPOSITORY } from '../../../app.constants';

@Injectable()
export class SnakeGameService {
  constructor(
    @InjectRepository(SnakeGame)
    private snakeGameRepository: Repository<SnakeGame> /*
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,*/,
  ) {}

  /*async countTheResult(
    snakeGameResultDto: SnakeGameResultDto,
    userId: number,
  ): Promise<SnakeGame> {}
*/
  async getSnakeGameInfo(userId: number) {
    const snakeGameInfo = await getConnection()
      .getRepository(SnakeGame)
      .createQueryBuilder('snakeGame')
      .where('snakeGame.user = :userId', { userId: userId })
      .leftJoinAndSelect('snakeGame.user', 'user')
      .getOne();

    if (snakeGameInfo) {
      return snakeGameInfo;
    }
    /*
    const initialSnakeGameInfo = new SnakeGame();
    const user = await this.userRepository.findOne(userId);
    initialSnakeGameInfo.user = user;
    return initialSnakeGameInfo;*/
  }
}
