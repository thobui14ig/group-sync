
import { Module } from '@nestjs/common';
import { GatewayModules } from 'src/infrastructure/socket/gateway.modules';
import { SyncNewPostGroupUseCase } from './sync-new-post-group.usecase';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [GatewayModules, HttpModule],
    controllers: [],
    providers: [SyncNewPostGroupUseCase],
    exports: [SyncNewPostGroupUseCase],
})
export class SyncNewPostGroupUseCaseModule { }