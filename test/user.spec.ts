import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../src/auth/auth.module';
import { UserModule } from '../src/user/user.module';
import { UserController } from '../src/user/user.controller';
import { FileUploadingController } from '../src/user/file.uploading.controller';
import { AppService } from '../src/app.service';
import { getConnection } from 'typeorm';

describe('App tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'School123',
          database: 'gameplay_test',
          entities: ['../src/**/*.entity.ts'],
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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await getConnection().query('DELETE FROM "user"');
    // YOU SHOULD CLEAR ALL DATABASES HERE BECAUSE IT CAN INFLUENCE TEST RESULTS
  });

  describe('User module', () => {
    it('User registration', async () => {
      const user = {
        username: 'username',
        email: 'email@mail.ru',
        password: 'password',
      };
      const data = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201);
      expect(data.body).toEqual({
        id: expect.any(Number),
        username: user.username,
        email: user.email,
        password: expect.any(String),
        avatarName: 'defaultAvatar.jpeg',
      });
    });

    it('User login', async () => {
      const user = {
        username: 'username',
        email: 'email@mail.ru',
        password: 'password',
      };
      const data = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201);

      const loginData = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          username: user.username,
          password: user.password,
        })
        .expect(201);
      expect(loginData.body).toEqual({
        id: expect.any(Number),
        username: user.username,
        email: user.email,
        accessToken: expect.any(String),
      });
    });
    it('Getting user profile', async () => {
      const user = {
        username: 'username',
        email: 'email@mail.ru',
        password: 'password',
      };
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201);

      const data = await request(app.getHttpServer())
        .get(`/${user.username}`)
        .expect(200);
      expect(data.body).toEqual({
        id: expect.any(Number),
        username: user.username,
        email: user.email,
        password: expect.any(String),
        avatarName: 'defaultAvatar.jpeg',
        subscribers: expect.any(Array),
        friends: expect.any(Array),
      });
    });
  });
});
