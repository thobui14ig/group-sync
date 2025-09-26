
import { Module } from '@nestjs/common';
import { SyncNewPostGroupUseCase } from './sync-new-post-group.usecase';
import { HttpModule } from '@nestjs/axios';
import { SocketModule } from 'src/infrastructure/common/socket/socket.module';
import { RedisModule } from 'src/infrastructure/common/redis/redis.module';

@Module({
    imports: [HttpModule, SocketModule, RedisModule],
    controllers: [],
    providers: [SyncNewPostGroupUseCase],
    exports: [SyncNewPostGroupUseCase],
})
export class SyncNewPostGroupUseCaseModule { }