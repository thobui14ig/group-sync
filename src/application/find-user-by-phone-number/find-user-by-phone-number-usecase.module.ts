import { Module } from "@nestjs/common";
import { FindUserByPhoneNumberUseCase } from "./find-user-by-phone-number-usecase";

@Module({
    imports: [],
    controllers: [],
    providers: [FindUserByPhoneNumberUseCase],
    exports: [FindUserByPhoneNumberUseCase],
})
export class FindUserByPhoneNumberUseCaseModule { }