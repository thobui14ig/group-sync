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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '91.99.31.157',
      port: 5432,
      username: 'root',
      password: '111111',
      database: 'group-sync',
      entities: [GroupEntity, UserEntity, ProxyEntity],
      synchronize: true,
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
