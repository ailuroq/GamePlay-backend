import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../src/auth/auth.module';
import { UserModule } from '../src/user/user.module';
import { AppService } from '../src/app.service';
import { getConnection } from 'typeorm';
import { GamesModule } from '../src/games/games.module';
import { ConfigModule } from '@nestjs/config';
import { TestDatabaseModule } from '../src/database/test.database.module';

describe('App tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MulterModule.register({
          dest: './uploads',
        }),
        TestDatabaseModule,
        AuthModule,
        UserModule,
        GamesModule,
      ],
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

    it('Getting users subscribers', async () => {
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
        .get(`/${user.username}/subscribers`)
        .expect(200);
      expect(data.body).toEqual({
        subscribers: expect.any(Array),
        page: expect.any(Number),
        limit: expect.any(Number),
        totalCount: expect.any(Number),
        numberOfPages: expect.any(Number),
      });
    });


  });
});
