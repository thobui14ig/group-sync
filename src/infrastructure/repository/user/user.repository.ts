import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) { }

    findByPhone(phoneNumber: string): Promise<UserEntity> {
        return this.repository.findOne({
            where: {
                phoneNumber
            }
        });
    }
}