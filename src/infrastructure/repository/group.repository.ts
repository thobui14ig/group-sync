import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupEntity } from "src/infrastructure/entity/group.entity";
import { Repository } from "typeorm";

@Injectable()
export class GroupRepository {
    constructor(
        @InjectRepository(GroupEntity)
        private repository: Repository<GroupEntity>,
    ) { }

    find() {
        return this.repository.find()
    }
}