import { Module } from "@nestjs/common";
import { GatewayModules } from "src/infrastructure/socket/gateway.modules";
import { GetPostsUseCase } from "./get-posts-usecase";

@Module({
    imports: [GatewayModules],
    controllers: [],
    providers: [GetPostsUseCase],
    exports: [GetPostsUseCase],
})
export class GetPostsUseCaseModule { }