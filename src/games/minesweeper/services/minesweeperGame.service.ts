import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { MinesweeperGameEntity } from '../entities/minesweeperGame.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MinesweeperGameResultDto } from '../dto/MinesweeperGameResult.dto';
import { PaginationMinesweeperDto } from '../dto/paginationMinesweeper.dto';
import { PaginatedUserTableMinesweeperResultDto } from '../dto/paginatedUserTableMinesweeperResult.dto';

@Injectable()
export class MinesweeperGameService {
  constructor(
    @InjectRepository(MinesweeperGameEntity)
    private minesweeperGameRepository: Repository<MinesweeperGameEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  async countTheResult(minesweeperGameResultDto: MinesweeperGameResultDto, userId: number) {
    if (minesweeperGameResultDto.maxScore < 0) {
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
      .update(MinesweeperGameEntity)
      .set({
        maxScore: minesweeperGameResultDto.maxScore,
      })
      .where('user = :userId', { userId: userId })
      .execute();

    return {
      ...minesweeperGameResultDto,
      userId,
    };
  }

  async getMinesweeperGameInfo(userId: number): Promise<MinesweeperGameEntity> {
    const minesweeperGameInfo = await getConnection()
      .getRepository(MinesweeperGameEntity)
      .createQueryBuilder('minesweeperGame')
      .where('minesweeperGame.user = :userId', { userId: userId })
      .leftJoinAndSelect('minesweeperGame.user', 'user')
      .getOne();

    if (minesweeperGameInfo) {
      return minesweeperGameInfo;
    }

    const user = await this.userRepository.findOne(userId);
    if (user) {
      const initialMinesweeperGameInfo = new MinesweeperGameEntity();
      initialMinesweeperGameInfo.user = user;
      return this.minesweeperGameRepository.save(initialMinesweeperGameInfo);
    }
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: `No user with id: ${userId}`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async getRatingTable(paginationDto: PaginationMinesweeperDto): Promise<PaginatedUserTableMinesweeperResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const totalCount = await this.minesweeperGameRepository.count();
    const table = await getConnection()
      .getRepository(MinesweeperGameEntity)
      .createQueryBuilder('minesweeperGame')
      .leftJoinAndSelect('minesweeperGame.user', 'user')
      .offset(skippedItems)
      .limit(paginationDto.limit)
      .orderBy('minesweeperGame.maxScore', 'DESC')
      .getMany();

    const numberOfPages = Math.ceil(totalCount / paginationDto.limit);

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: table,
      numberOfPages: numberOfPages,
    };
  }
}
