import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SnakeGame } from '../entities/snakeGame.entity';
import { getConnection, Repository } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { SnakeGameResultDto } from '../dto/snakeGameResult.dto';

@Injectable()
export class SnakeGameService {
  constructor(
    @InjectRepository(SnakeGame)
    private snakeGameRepository: Repository<SnakeGame>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async countTheResult(snakeGameResultDto: SnakeGameResultDto, userId: number) {
    if (snakeGameResultDto.lastScore < 0 || snakeGameResultDto.maxScore < 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Incorrect data`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await getConnection()
      .createQueryBuilder()
      .update(SnakeGame)
      .set({
        lastScore: snakeGameResultDto.lastScore,
        maxScore: snakeGameResultDto.maxScore,
      })
      .where('user = :userId', { userId: userId })
      .execute();

    return {
      ...snakeGameResultDto,
      userId,
    };
  }

  async getSnakeGameInfo(userId: number): Promise<SnakeGame> {
    const snakeGameInfo = await getConnection()
      .getRepository(SnakeGame)
      .createQueryBuilder('snakeGame')
      .where('snakeGame.user = :userId', { userId: userId })
      .leftJoinAndSelect('snakeGame.user', 'user')
      .getOne();

    if (snakeGameInfo) {
      return snakeGameInfo;
    }

    const user = await this.userRepository.findOne(userId);
    if (user) {
      const initialSnakeGameInfo = new SnakeGame();
      initialSnakeGameInfo.user = user;
      return this.snakeGameRepository.save(initialSnakeGameInfo);
    }
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `No user with id: ${userId}`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
