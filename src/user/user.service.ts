import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { DEFAULT_USER_AVATAR } from '../app.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(username: string): Promise<User> {
    return this.userRepository.findOne({ username: username });
  }
  findById(id: any): Promise<User> {
    return this.userRepository.findOne({ id: id });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const user = await this.findOne(userDto.username);
    if (!user) {
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
