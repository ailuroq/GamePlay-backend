import { Body, Request, Controller, Get, Post, Param } from '@nestjs/common';
import { SnakeGameService } from '../services/snakeGame.service';
import { SnakeGameResultDto } from '../dto/snakeGameResult.dto';

@Controller()
export class SnakeGameController {
  constructor(private snakeGameService: SnakeGameService) {}

  @Post('snake-game/result')
  async countTheResult(
    @Body() snakeGameResultDto: SnakeGameResultDto,
    @Request() req,
  ) {
    return;
  }

  @Get('')
  async getRatingTable() {
    return;
  }

  @Get('snake-game/:userId')
  async getSnakeGameUserInfo(@Param() params) {
    return this.snakeGameService.getSnakeGameInfo(params.userId);
  }
}
