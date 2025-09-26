
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ResetIpMproxyUseCase } from './reset-ip-mproxy-usecase';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [ResetIpMproxyUseCase],
    exports: [ResetIpMproxyUseCase],
})
export class ResetIpMproxyUseCaseModule { }