import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SnakeGameService } from '../services/snakeGame.service';
import { SnakeGameResultDto } from '../dto/snakeGameResult.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedUserTableResultDto } from '../dto/paginatedUserTableResult.dto';

@Controller('/snake-game/')
export class SnakeGameController {
  constructor(private snakeGameService: SnakeGameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('result')
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
  @Get('user/:userId')
  async getSnakeGameUserInfo(@Param() params) {
    return this.snakeGameService.getSnakeGameInfo(params.userId);
  }

  @Get('rating')
  async getRatingTable(@Query() paginationDto: PaginationDto): Promise<PaginatedUserTableResultDto> {
    paginationDto.page = Number(paginationDto.page);
    return this.snakeGameService.getRatingTable({
      ...paginationDto,
      limit: 8,
    });
  }
}
