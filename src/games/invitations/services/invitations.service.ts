import { Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationsEntity } from '../entities/invitations.entity';
import { User } from '../../../user/entities/user.entity';
import { CreateInvitationDto } from '../dto/CreateInvitationDto';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(InvitationsEntity) private invitationRepository: Repository<InvitationsEntity>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
  }

  async getInvitationsForCurrentUser(userId: number) {
    return await this.userRepository.query(`select invitations_entity."gameName", "user".id, "user".username, "user".email, "user"."avatarName" from invitations_entity
join "user" on invitations_entity."authorId" = "user".id
where invitations_entity."userId" = $1`, [userId]);
  }

  async sendNewInvitation(username: string, userId: number, userDto: CreateInvitationDto) {
    const loggedUser = await this.userRepository.findOne({ where: { id: userId } });
    const user = await this.userRepository.findOne({ where: { username: username } });
    const invitation = await this.invitationRepository.create({ ...userDto, user, author: loggedUser });
    await this.invitationRepository.save(invitation);
  }

  async acceptFriendInvitation(id: number, userId: number, userDto: CreateInvitationDto) {

    await getConnection()
      .query(`delete from invitations_entity where invitations_entity."authorId" = $1 and invitations_entity."gameName" = $2`, [id, userDto.gameName]);

    return await this.invitationRepository.query(`select invitations_entity."gameName", "user".id, "user".username, "user".email, "user"."avatarName" from invitations_entity
join "user" on invitations_entity."authorId" = "user".id
where invitations_entity."userId" = $1`, [userId]);
  }

}
