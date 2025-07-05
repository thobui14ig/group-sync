import { Module } from "@nestjs/common";
import { CheckLiveProxyUseCase } from "./check-live-proxy-useacse";

@Module({
    imports: [],
    controllers: [],
    providers: [CheckLiveProxyUseCase],
    exports: [CheckLiveProxyUseCase],
})
export class CheckLiveProxyUseCaseModule { }