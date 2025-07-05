import { Controller, Get } from '@nestjs/common';
import { GetPostsUseCase } from 'src/application/get-post/get-posts-usecase';
import { AppGateway } from 'src/infrastructure/socket/app.gateway';

@Controller('posts')
export class PostController {
    constructor(private getPostsUseCase: GetPostsUseCase) { }

    @Get()
    getPosts() {
        return this.getPostsUseCase.execute()
    }
}