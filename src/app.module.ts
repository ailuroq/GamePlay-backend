import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Connection } from 'typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { GamesModule } from './games/games.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    GamesModule,
  ],
  providers: [AppService],
})
export class AppModule {}
