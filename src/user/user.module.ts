import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Image } from './image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Image])],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
