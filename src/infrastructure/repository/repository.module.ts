import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { ProxyEntity } from "../entity/proxy.entity";
import { GroupRepository } from "./group.repository";
import { GroupEntity } from "../entity/group.entity";
import { ProxyRepository } from "./proxy.repository";

const repositories = [GroupRepository, ProxyRepository]
@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, ProxyEntity, GroupEntity])],
    controllers: [],
    providers: [...repositories],
    exports: [...repositories],
})
export class RepositoryModule { }