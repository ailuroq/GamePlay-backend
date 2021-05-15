import { Body, Request, Controller, Get, Post, Param, UseGuards, Query, } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { MinesweeperGameService } from '../services/minesweeperGame.service';
import { MinesweeperGameResultDto } from '../dto/MinesweeperGameResult.dto';
import { PaginatedUserTableMinesweeperResultDto } from '../dto/paginatedUserTableMinesweeperResult.dto';
import { PaginationMinesweeperDto } from '../dto/paginationMinesweeper.dto';

@Controller('/minesweeper/')
export class MinesweeperGameController {
  constructor(private minesweeperGameService: MinesweeperGameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('minesweeperResult')
  async countTheResult(@Body() minesweeperGameResultDto: MinesweeperGameResultDto, @Request() req,) {
    return this.minesweeperGameService.countTheResult(minesweeperGameResultDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('minesweeperUser/:userId')
  async getMinesweeperGameUserInfo(@Param() params) {
    return this.minesweeperGameService.getMinesweeperGameInfo(params.userId);
  }

  @Get('minesweeperRating')
  async getRatingTable(@Query() paginationDto: PaginationMinesweeperDto): Promise<PaginatedUserTableMinesweeperResultDto> {
    paginationDto.page = Number(paginationDto.page);
    return this.minesweeperGameService.getRatingTable({
      ...paginationDto,
      limit: 8,
    });
  }
}
