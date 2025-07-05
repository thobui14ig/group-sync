import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../entity/user.entity";
import { UserRepository } from "./user/user.repository";
import { ProxyRepository } from "./user/proxy.repository";
import { ProxyEntity } from "../entity/proxy.entity";
import { GroupRepository } from "./user/group.repository";
import { GroupEntity } from "../entity/group.entity";

const repositories = [UserRepository, ProxyRepository, GroupRepository]
@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, ProxyEntity, GroupEntity])],
    controllers: [],
    providers: [...repositories],
    exports: [...repositories],
})
export class RepositoryModule { }