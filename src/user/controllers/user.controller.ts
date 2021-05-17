import { Controller, Request, Post, UseGuards, Get, Body, Param, Query, Delete } from '@nestjs/common';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { AuthService } from '../../auth/auth.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { AuthUser } from '../../common/decorators/auth-user.decorator';
import { User } from '../entities/user.entity';
import { UserDecorator } from '../decorators/user.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { QueryDto } from '../dto/QueryDto';

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

  @Post(':username/sendFriendRequest')
  @UseGuards(new JwtAuthGuard())
  sendFriendRequest(
    @Param('username') username: string,
    @UserDecorator('id') user: number,
  ) {
    return this.userService.sendRequest(username, user);
  }

  @Post(':username/acceptFriendRequest')
  @UseGuards(new JwtAuthGuard())
  acceptFriendRequest(
    @Param('username') username: string,
    @UserDecorator('id') user: number,
  ) {
    return this.userService.acceptRequest(username, user);
  }

  @Post(':username/cancelFriendRequest')
  @UseGuards(new JwtAuthGuard())
  cancelFriendRequest(
    @Param('username') username: string,
    @UserDecorator('id') user: number,
  ) {
    return this.userService.cancelRequest(username, user);
  }

  @Delete(':username/deleteFriend')
  @UseGuards(new JwtAuthGuard())
  deleteFriend(@Param('username') username: string, @UserDecorator('id') user: number) {
    return this.userService.deleteFriend(username, user);
  }

  @Get(':username/friends')
  getUsersFriends(@Query('page') page: number,
                  @Param('username') username: string) {
    return this.userService.getFriends(page, username);
  }

  @Get(':username/subscribers')
  getUsersSubscribers(@Query('page') page: number,
                  @Param('username') username: string) {
    return this.userService.getSubscribers(page, username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@AuthUser() user: User) {
    const newUser = await this.userService.findOne(user.username);
    return this.authService.login(newUser);
  }

  @Get('getCurrentUser/:username')
  @UseGuards(JwtAuthGuard)
  getCurrentUserInfo(@Param('username') username: string, @UserDecorator('id') user: number) {
    return this.userService.getCurrentUser(username, user);
  }

  @Post('auth/getAllUsers')
  async usersGet(@Query('page') page: number, @Body() queryDto : QueryDto) {
    return this.userService.getAllUsers(page, queryDto);
  }

}
