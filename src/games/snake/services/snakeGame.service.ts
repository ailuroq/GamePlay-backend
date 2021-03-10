import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SnakeGame } from '../entities/snakeGame.entity';
import { getConnection, Repository } from 'typeorm';
import { User } from '../../../user/user.entity';

@Injectable()
export class SnakeGameService {
  constructor(
    @InjectRepository(SnakeGame)
    private snakeGameRepository: Repository<SnakeGame>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    const initialSnakeGameInfo = new SnakeGame();
    const user = await this.userRepository.findOne(userId);
    initialSnakeGameInfo.user = user;
    return initialSnakeGameInfo;
  }
}
