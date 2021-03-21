import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class TypingRaceGameModule {}
