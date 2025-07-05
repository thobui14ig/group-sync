import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { delay } from "src/common/helper";
import { ProxyEntity, ProxyStatus } from "src/infrastructure/entity/proxy.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProxyRepository {
    proxies: ProxyEntity[] = []

    constructor(
        @InjectRepository(ProxyEntity)
        private repository: Repository<ProxyEntity>,
    ) { }

    async autoRandomProxy() {
        const proxies = await this.repository.find({
            where: {
                status: ProxyStatus.ACTIVE
            }
        })
        this.proxies = proxies
    }

    find() {
        return this.repository.find()
    }

    update(proxy: ProxyEntity) {
        return this.repository.save(proxy)
    }

    async getRandomProxy(): Promise<ProxyEntity> {
        if (this.proxies.length === 0) {
            await delay(5000)
            return this.getRandomProxy()
        }
        const randomIndex = Math.floor(Math.random() * this.proxies?.length);
        const randomProxy = this.proxies[randomIndex];

        return randomProxy
    }
}