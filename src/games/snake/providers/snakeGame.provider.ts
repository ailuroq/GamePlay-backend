/*
  import { Connection } from 'typeorm';
  import {
    DATABASE_CONNECTION,
    SNAKE_GAME_REPOSITORY,
  } from '../../../app.constants';
  import { SnakeGame } from '../entities/snakeGame.entity';

  export const snakeGameProvider = [
    {
      provide: SNAKE_GAME_REPOSITORY,
      useFactory: (connection: Connection) => connection.getRepository(SnakeGame),
      inject: [DATABASE_CONNECTION],
    },
  ];
  */
