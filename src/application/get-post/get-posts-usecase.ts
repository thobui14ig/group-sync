import { Injectable } from "@nestjs/common";
import { AppGateway } from "src/infrastructure/socket/app.gateway";

@Injectable()
export class GetPostsUseCase {
    constructor(
        private gateway: AppGateway
    ) { }

    async execute() {
        return this.gateway.posts
    }
}