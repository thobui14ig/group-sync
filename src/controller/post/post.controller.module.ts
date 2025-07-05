import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { GetPostsUseCaseModule } from "src/application/get-post/get-posts-usecase.module";

@Module({
    imports: [GetPostsUseCaseModule],
    controllers: [PostController],
    providers: [],
})
export class PostControllerModule { }