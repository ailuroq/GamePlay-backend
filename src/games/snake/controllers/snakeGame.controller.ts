import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SnakeGameService } from '../services/snakeGame.service';
import { SnakeGameResultDto } from '../dto/snakeGameResult.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller()
export class SnakeGameController {
  constructor(private snakeGameService: SnakeGameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('snake-game/result')
  async countTheResult(
    @Body() snakeGameResultDto: SnakeGameResultDto,
    @Request() req,
  ) {
    return this.snakeGameService.countTheResult(
      snakeGameResultDto,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('snake-game/:userId')
  async getSnakeGameUserInfo(@Param() params) {
    return this.snakeGameService.getSnakeGameInfo(params.userId);
  }

  @Get('')
  async getRatingTable() {
    return;
  }
}
