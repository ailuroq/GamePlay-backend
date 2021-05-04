import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createQueryBuilder, getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { DEFAULT_USER_AVATAR } from '../../app.constants';

import * as bcrypt from 'bcrypt';
import { UserRO } from '../dto/users.ro';
import { UsersFriendsRo } from '../dto/usersFriends.ro';
import { UsersSubscribersRo } from '../dto/usersSubscribers.ro';
import { SnakeGame } from '../../games/snake/entities/snakeGame.entity';
import { log } from 'util';
import { CurrentUserDto } from '../dto/currentUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  findOne(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['subscribers', 'friends'],
    });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const user = await this.findOne(userDto.username);
    if (!user) {
      userDto.avatarName = DEFAULT_USER_AVATAR;
      userDto.password = await bcrypt.hash(userDto.password, 10);
      return this.userRepository.save(userDto);
    }
    throw new HttpException(
      'Such user already exists',
      HttpStatus.BAD_REQUEST,
    );
  }

  async sendRequest(username: string, userId: number): Promise<UserRO> {
    const userToAdd = await this.userRepository.findOne({
      where: { id: userId },
    });
    const user = await this.userRepository.findOne({
      where: { username: username },
      relations: ['subscribers', 'friends'],
    });
    if (user) {
      if (userToAdd.id !== user.id) {
        if (
          user.subscribers.filter(
            (subscriber) => subscriber.id === userToAdd.id,
          ).length < 1
        ) {
          user.subscribers.push(userToAdd);
          await this.userRepository.save(user);
        } else {
          throw new HttpException(
            'You have already send request to this user',
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException('Can not do this add', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user.toResponseObject(false);
  }

  async acceptRequest(username: string, userId: number) {
    const userToAddFriend = await this.userRepository.findOne({
      where: { username: username },
      relations: ['subscribers', 'friends'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscribers', 'friends'],
    });
    if (userToAddFriend) {
      if (user.subscribers.filter((subscriber) => subscriber.id === userToAddFriend.id).length === 1) {
        user.subscribers = user.subscribers.filter((subscriber) => subscriber.id !== userToAddFriend.id);
        user.friends.push(userToAddFriend);
        await this.userRepository.save(user);
        userToAddFriend.subscribers = userToAddFriend.subscribers.filter((subscriber) => subscriber.id !== user.id);
        userToAddFriend.friends.push(user);
        await this.userRepository.save(userToAddFriend);
      } else {
        throw new HttpException(
          'You do not have such subscriber',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async cancelRequest(username: string, userId: number): Promise<UserRO> {
    const userToCancelFriendRequest = await this.userRepository.findOne({
      where: { username: username },
      relations: ['subscribers', 'friends'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (userToCancelFriendRequest) {
      if (
        userToCancelFriendRequest.subscribers.filter(
          (subscriber) => subscriber.id === user.id,
        ).length === 1
      ) {
        userToCancelFriendRequest.subscribers = userToCancelFriendRequest.subscribers.filter(
          (subscriber) => subscriber.id !== user.id,
        );
        await this.userRepository.save(userToCancelFriendRequest);
      } else {
        throw new HttpException(
          'You are not subscriber of this person',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return userToCancelFriendRequest.toResponseObject(false);
  }

  async deleteFriend(username: string, userId: number) {
    const userToDelete = await this.userRepository.findOne({
      where: { username: username },
      relations: ['friends'],
    });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subscribers', 'friends'],
    });
    if (userToDelete) {
      if (user.friends.filter((friend) => friend.id === userToDelete.id).length === 1) {
        user.friends = user.friends.filter((friend) => friend.id !== userToDelete.id);
        user.subscribers.push(userToDelete);
        await this.userRepository.save(user);
        userToDelete.friends = userToDelete.friends.filter((friend) => friend.id !== user.id);
        await this.userRepository.save(userToDelete);
      } else {
        throw new HttpException(
          'You do not have such friend, bro',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getFriends(page: number = 1, username: string): Promise<UsersFriendsRo> {
    let friends;
    const user = await this.userRepository.findOne({
      where: { username: username },
      relations: ['friends'],
    });
    const totalCount = user.friends.length;
    const numberOfPages = Math.ceil(totalCount / 5);
    friends = user.friends.slice((page - 1) * 5, page * 5);


    return {
      friends,
      page: page,
      limit: 5,
      totalCount: totalCount,
      numberOfPages: numberOfPages,
    };
  }

  async getSubscribers(page: number = 1, username: string): Promise<UsersSubscribersRo> {
    const user = await this.userRepository.findOne({
      where: { username: username },
      relations: ['subscribers'],
    });
    const totalCount = user.subscribers.length;
    const numberOfPages = Math.ceil(totalCount / 5);
    const subscribers = user.subscribers.slice((page - 1) * 5, page * 5);

    return {
      subscribers,
      page: page,
      limit: 5,
      totalCount: totalCount,
      numberOfPages: numberOfPages,
    };
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

  async getCurrentUser(username: string, userId: number): Promise<CurrentUserDto> {
    let isFriend;
    const loginUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends', 'subscribers'],
    });
    const currentUser = await this.userRepository.findOne({
      where: { username: username },
      relations: ['subscribers'],
    });
    if (loginUser.friends.find((item) => item.username === username)) {
      isFriend = 'friend';
    } else if (loginUser.subscribers.find((item) => item.username === username)) {
      isFriend = 'subscriber';
    } else if (currentUser.subscribers.find((item) => item.username === username)) {
      isFriend = 'meIsSubscriber';
    } else {
      isFriend = 'no';
    }
    return {
      currentUser: currentUser.toResponseObject(false),
      isFriend: isFriend,
    };
  }
}
