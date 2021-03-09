import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { FileUploadingController } from './user/file.uploading.controller';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'School123',
      database: 'gameplay',
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [UserController, FileUploadingController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
