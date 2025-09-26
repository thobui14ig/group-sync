import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupEntity } from "src/infrastructure/entity/group.entity";
import { MoreThanOrEqual, Repository } from "typeorm";
import { ProxyEntity } from "../entity/proxy.entity";

@Injectable()
export class ProxyRepository {
    constructor(
        @InjectRepository(ProxyEntity)
        private repository: Repository<ProxyEntity>,
    ) { }

    findOne() {
        return this.repository.findOne({
            where: {
                id: MoreThanOrEqual(1)
            }
        })
    }
}