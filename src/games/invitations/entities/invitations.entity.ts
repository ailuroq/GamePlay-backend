import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../user/entities/user.entity';

@Entity()
export class InvitationsEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  gameName: string

  @ManyToOne(type => User)
  @JoinTable()
  author: User

  @ManyToOne(type => User, user => user.invitations)
  user: User
}