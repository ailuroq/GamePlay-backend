import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { InvitationsEntity } from './entities/invitations.entity';
import { InvitationsService } from './services/invitations.service';
import { InvitationsController } from './controllers/invitations.controller';


@Module({
  imports: [TypeOrmModule.forFeature([User, InvitationsEntity])],
  providers: [InvitationsService],
  controllers: [InvitationsController],
})

export class InvitationsModule{}
