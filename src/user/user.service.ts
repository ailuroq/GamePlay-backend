import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

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

  create(userDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(userDto);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
