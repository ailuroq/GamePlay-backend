import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'gameplay',
      entities: ['../src/**/*.entity.ts'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    UserModule,
    GamesModule,
  ],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
