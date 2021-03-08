import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SnakeGame } from '../entities/snakeGame.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SnakeGameService {
  constructor(
    @InjectRepository(SnakeGame)
    private snakeGameRepository: Repository<SnakeGame>,
  ) {}
}
