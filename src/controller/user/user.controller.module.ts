import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { FindUserByPhoneNumberUseCaseModule } from "src/application/find-user-by-phone-number/find-user-by-phone-number-usecase.module";

@Module({
    imports: [FindUserByPhoneNumberUseCaseModule],
    controllers: [UserController],
    providers: [],
})
export class UserControllerModule { }