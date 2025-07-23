import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CheckLiveProxyUseCase } from 'src/application/check-live-proxy/check-live-proxy-useacse';
import { GetRandomProxyLiveUseCase } from 'src/application/get-random-proxy-live/get-random-proxy-live-usecase';
import { RotateProxyUseCase } from 'src/application/rotate-proxy/rotate-proxy-usecase';
import { SyncNewPostGroupUseCase } from 'src/application/sync-new-post-group/sync-new-post-group.usecase';

@Controller('')
export class CronjobController {
    isCheckLiveProxy: boolean = false
    constructor(
        private syncNewPostGroupUseCase: SyncNewPostGroupUseCase,
        private checkLiveProxyUseCase: CheckLiveProxyUseCase,
        private getRandomProxyLiveUseCase: GetRandomProxyLiveUseCase,
        private rotateProxyUseCase: RotateProxyUseCase
    ) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    syncNewPostGroup() {
        return this.syncNewPostGroupUseCase.execute()
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async checkLiveProxy() {
        if (this.isCheckLiveProxy) return

        return this.checkLiveProxyUseCase.execute()
    }

    // @Cron(CronExpression.EVERY_5_SECONDS)
    // async autoRandomProxyLive() {
    //     return this.getRandomProxyLiveUseCase.execute()
    // }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async rotateProxy() {
        return this.rotateProxyUseCase.execute()
    }
}