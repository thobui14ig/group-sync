import { Module } from '@nestjs/common';
import { SyncNewPostGroupUseCaseModule } from 'src/application/sync-new-post-group/sync-new-post-group.usecase.module';
import { CronjobController } from './cronjob.controller';
import { ResetIpMproxyUseCaseModule } from 'src/application/reset-ip-mproxy/reset-ip-mproxy.module';


@Module({
    imports: [SyncNewPostGroupUseCaseModule, ResetIpMproxyUseCaseModule],
    controllers: [CronjobController],
    providers: [],
})
export class CronjobControllerModule { }