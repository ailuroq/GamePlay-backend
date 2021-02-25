import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body, Param
} from "@nestjs/common";
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { DEFAULT_USER_AVATAR } from '../app.constants';
@Controller()
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('auth/signup')
  async create(@Body() userDto: CreateUserDto): Promise<User> {
    userDto.avatarName = DEFAULT_USER_AVATAR;
    return this.userService.create(userDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/signin')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get(':username/')
  getProfile(@Param() params) {
    return this.userService.findOne(params.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@AuthUser() user: User) {
    const newUser = await this.userService.findOne(user.username);
    return this.authService.login(newUser);
  }
}
