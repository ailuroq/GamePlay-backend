import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserDecorator } from '../../../user/decorators/user.decorator';
import { CreateInvitationDto } from '../dto/CreateInvitationDto';
import { InvitationsService } from '../services/invitations.service';


@Controller('api/invitations')
export class InvitationsController {
  constructor(private invitationsService: InvitationsService) {}

  @Get('getInvitationsForCurrentUser')
  @UseGuards(JwtAuthGuard)
  invitationsForCurrentUser(@UserDecorator('id') user: number) {
    return this.invitationsService.getInvitationsForCurrentUser(user);
  }

  @Post('sendInvitation/:username')
  @UseGuards(JwtAuthGuard)
  createInvitation(@Param('username') username: string, @UserDecorator('id') user: number, @Body() invitation: CreateInvitationDto) {
    return this.invitationsService.sendNewInvitation(username, user, invitation);
  }

  @Post('acceptInvitation/:id')
  @UseGuards(JwtAuthGuard)
  acceptInvitation(@Param('id') id: number, @UserDecorator('id') user: number, @Body() invitation: CreateInvitationDto) {
    return this.invitationsService.acceptFriendInvitation(id, user, invitation);
  }
}