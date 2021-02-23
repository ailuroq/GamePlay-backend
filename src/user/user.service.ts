import { Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Image } from './image.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
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

  create(userDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(userDto);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async createAvatar(filename: string, user: User) {
    const avatar = new Image();
    avatar.name = filename;
    await this.imageRepository.save(avatar);
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ avatar: avatar })
      .where('id = :id', { id: user.id })
      .execute();
  }
}
