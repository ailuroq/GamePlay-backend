import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { User } from './user.entity';
import {UserDecorator} from './user.decorator'
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('auth/signup')
  async create(@Body() userDto: CreateUserDto): Promise<User> {
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

  @Post(':id/sendFriendRequest')
  @UseGuards(new JwtAuthGuard())
  sendFriendRequest(@Param('id') id: number, @UserDecorator('id') user : number){
    return this.userService.sendRequest(id, user)
  }

  @Post(':id/acceptFriendRequest')
  @UseGuards(new JwtAuthGuard())
  acceptFriendRequest(@Param('id') id: number, @UserDecorator('id') user : number){
    return this.userService.acceptRequest(id, user)
  }

  @Post(':id/cancelFriendRequest')
  @UseGuards(new JwtAuthGuard())
  cancelFriendRequest(@Param('id') id: number, @UserDecorator('id') user : number){
    return this.userService.cancelRequest(id, user)
  }

  @Post(':id/deleteFriend')
  @UseGuards(new JwtAuthGuard())
  deleteFriend(@Param('id') id: number, @UserDecorator('id') user : number){
    return this.userService.deleteFriend(id, user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@AuthUser() user: User) {
    const newUser = await this.userService.findOne(user.username);
    return this.authService.login(newUser);
  }

}
