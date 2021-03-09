import { Controller, Get, Post } from '@nestjs/common';
import { SnakeGameService } from '../services/snakeGame.service';

@Controller()
export class SnakeGameController {
  constructor(private snakeGameService: SnakeGameService) {}

  @Post('')
  async getGameResult() {
    return;
  }

  @Get('')
  async getRatingTable() {
    return;
  }
}
