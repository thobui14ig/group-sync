
import { Module } from '@nestjs/common';
import { SyncNewPostGroupUseCase } from './sync-new-post-group.usecase';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [SyncNewPostGroupUseCase],
    exports: [SyncNewPostGroupUseCase],
})
export class SyncNewPostGroupUseCaseModule { }