import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST_TEST'),
        port: configService.get('POSTGRES_PORT_TEST'),
        username: configService.get('POSTGRES_USER_TEST'),
        password: configService.get('POSTGRES_PASSWORD_TEST'),
        database: configService.get('POSTGRES_DB_TEST'),
        entities: [__dirname + '/../**/*.entity.ts'],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class TestDatabaseModule {}
