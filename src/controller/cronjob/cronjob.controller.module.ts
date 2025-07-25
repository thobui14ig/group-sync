import { Module } from '@nestjs/common';
import { SyncNewPostGroupUseCaseModule } from 'src/application/sync-new-post-group/sync-new-post-group.usecase.module';
import { CronjobController } from './cronjob.controller';
import { CheckLiveProxyUseCaseModule } from 'src/application/check-live-proxy/check-live-proxy-useacse.module';
import { GetRandomProxyLiveUseCaseModule } from 'src/application/get-random-proxy-live/get-random-proxy-live-usecase.module';
import { RotateProxyUseCaseModule } from 'src/application/rotate-proxy/rotate-proxy-usecase.module';

@Module({
    imports: [SyncNewPostGroupUseCaseModule, CheckLiveProxyUseCaseModule, GetRandomProxyLiveUseCaseModule, RotateProxyUseCaseModule],
    controllers: [CronjobController],
    providers: [],
})
export class CronjobControllerModule { }