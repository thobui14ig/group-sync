import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronjobControllerModule } from './controller/cronjob/cronjob.controller.module';
import { GroupEntity } from './infrastructure/entity/group.entity';
import { ProxyEntity } from './infrastructure/entity/proxy.entity';
import { UserEntity } from './infrastructure/entity/user.entity';
import { RepositoryModule } from './infrastructure/repository/repository.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<string>('DB_TYPE') as any,
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
        username: configService.get<string>('DB_USER_NAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [GroupEntity, UserEntity, ProxyEntity],
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    RepositoryModule,
    CronjobControllerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
