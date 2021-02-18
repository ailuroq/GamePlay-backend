import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.userService.create(userDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/')
  getProfile(@AuthUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@AuthUser() user: User) {
    const newUser = await this.userService.findOne(user.username);
    return this.authService.login(newUser);
  }
}
