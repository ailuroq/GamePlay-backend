import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { DEFAULT_USER_AVATAR } from '../app.constants';

import * as bcrypt from 'bcrypt';
import { UserRO } from './users.ro';
import { subscribeTo } from 'rxjs/internal-compatibility';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(username: string): Promise<User> {
    return this.userRepository.findOne({
        where: { username },
        relations: ['subscribers', 'friends'],
      },
    );
  }

  findById(id: any): Promise<User> {
    return this.userRepository.findOne({ id: id });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const user = await this.findOne(userDto.username);
    if (!user) {
      userDto.avatarName = DEFAULT_USER_AVATAR;
      userDto.password = await bcrypt.hash(userDto.password, 10);
      return this.userRepository.save(userDto);
    }
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'This user already exists',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async sendRequest(id: number, userId: number): Promise<UserRO> {
    const userToAdd = await this.userRepository.findOne({ where: { id: userId } });
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['subscribers', 'friends'],
    });
    if (user) {
      if (userToAdd.id !== user.id) {
        if (user.subscribers.filter(subscriber => subscriber.id === userToAdd.id).length < 1) {
          user.subscribers.push(userToAdd);
          await this.userRepository.save(user);
        } else {
          throw new HttpException('You have already send request to this user', HttpStatus.BAD_REQUEST);
        }
      } else {
        throw new HttpException('Can not do this add', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user.toResponseObject(false);
  }


  async acceptRequest(id: number, userId: number): Promise<UserRO> {
    const userToAddFriend = await this.userRepository.findOne({ where: { id: id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscribers', 'friends'],
    });
    if (userToAddFriend) {
      if (user.subscribers.filter(subscriber => subscriber.id === userToAddFriend.id).length === 1) {
        user.subscribers = user.subscribers.filter(subscriber => subscriber.id !== userToAddFriend.id);
        user.friends.push(userToAddFriend);
        await this.userRepository.save(user);
      } else {
        throw new HttpException('You do not have such subscriber', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user.toResponseObject(false);
  }

  async cancelRequest(id: number, userId: number): Promise<UserRO> {
    const userToCancelFriendRequest = await this.userRepository.findOne({
      where: { id: id },
      relations: ['subscribers', 'friends'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });
    if (userToCancelFriendRequest) {
      if (userToCancelFriendRequest.subscribers.filter(subscriber => subscriber.id === user.id).length === 1) {
        userToCancelFriendRequest.subscribers = userToCancelFriendRequest.subscribers.filter(subscriber => subscriber.id !== user.id);
        await this.userRepository.save(userToCancelFriendRequest);
      } else {
        throw new HttpException('You are not subscriber of this person', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return userToCancelFriendRequest.toResponseObject(false);
  }

  async deleteFriend(id: number, userId: number): Promise<UserRO> {
    const userToDelete = await this.userRepository.findOne({
      where: { id: id }
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscribers', 'friends']
    });
    if (userToDelete) {
      if (user.friends.filter(friend => friend.id === userToDelete.id).length === 1) {
        user.friends = user.friends.filter(friend => friend.id !== userToDelete.id);
        user.subscribers.push(userToDelete)
        await this.userRepository.save(user);
      } else {
        throw new HttpException('You do not have such friend, bro', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user.toResponseObject(false);
  }


  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async createAvatar(filename: string, user: User) {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ avatarName: filename })
      .where('id = :id', { id: user.id })
      .execute();
  }

  async deleteAvatar(user: User) {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ avatarName: DEFAULT_USER_AVATAR })
      .where('id = :id', { id: user.id })
      .execute();
  }
}
