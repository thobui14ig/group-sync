import { Module } from "@nestjs/common";
import { GetRandomProxyLiveUseCase } from "./get-random-proxy-live-usecase";

@Module({
    imports: [],
    controllers: [],
    providers: [GetRandomProxyLiveUseCase],
    exports: [GetRandomProxyLiveUseCase],
})
export class GetRandomProxyLiveUseCaseModule { }