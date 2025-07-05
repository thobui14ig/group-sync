import { Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "src/infrastructure/repository/user/user.repository";

@Injectable()
export class FindUserByPhoneNumberUseCase {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async execute(phone: string,) {
        const { password, ...user } = await this.userRepository.findByPhone(phone) || null

        return user
    }
}