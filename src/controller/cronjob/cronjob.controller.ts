import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ResetIpMproxyUseCase } from 'src/application/reset-ip-mproxy/reset-ip-mproxy-usecase';
import { SyncNewPostGroupUseCase } from 'src/application/sync-new-post-group/sync-new-post-group.usecase';

@Controller('')
export class CronjobController {
    isCheckLiveProxy: boolean = false
    constructor(
        private syncNewPostGroupUseCase: SyncNewPostGroupUseCase,
        private resetIpMproxyUseCase: ResetIpMproxyUseCase,
    ) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    syncNewPostGroup() {
        return this.syncNewPostGroupUseCase.execute()
    }

    @Cron(CronExpression.EVERY_MINUTE)
    resetIp() {
        return this.resetIpMproxyUseCase.execute()
    }
}