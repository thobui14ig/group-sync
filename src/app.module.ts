import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthControllerModule } from './controller/auth/auth.controller.module';
import { CronjobControllerModule } from './controller/cronjob/cronjob.controller.module';
import { UserControllerModule } from './controller/user/user.controller.module';
import { GroupEntity } from './infrastructure/entity/group.entity';
import { ProxyEntity } from './infrastructure/entity/proxy.entity';
import { UserEntity } from './infrastructure/entity/user.entity';
import { RepositoryModule } from './infrastructure/repository/repository.module';
import { GatewayModules } from './infrastructure/socket/gateway.modules';
import { PostControllerModule } from './controller/post/post.controller.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
      exclude: ['/^\/api/'], // Đây là cách chắc chắn đúng
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASS', '111111'),
        database: configService.get<string>('DB_NAME', 'group-sync'),
        entities: [GroupEntity, UserEntity, ProxyEntity],
        synchronize: true,
      }),
    }),
    ScheduleModule.forRoot(),
    RepositoryModule,
    CronjobControllerModule,
    AuthControllerModule,
    UserControllerModule,
    PostControllerModule,
    GatewayModules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
