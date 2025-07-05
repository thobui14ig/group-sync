import { Injectable } from "@nestjs/common";
import { ProxyRepository } from "src/infrastructure/repository/user/proxy.repository";

@Injectable()
export class GetRandomProxyLiveUseCase {
    constructor(
        private proxyRepository: ProxyRepository,
    ) { }

    async execute() {
        return this.proxyRepository.autoRandomProxy()
    }
}