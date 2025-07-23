import { Module } from "@nestjs/common";
import { RotateProxyUseCase } from "./rotate-proxy-usecase";

@Module({
    imports: [],
    controllers: [],
    providers: [RotateProxyUseCase],
    exports: [RotateProxyUseCase],
})
export class RotateProxyUseCaseModule { }