import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { FindUserByPhoneNumberUseCase } from 'src/application/find-user-by-phone-number/find-user-by-phone-number-usecase';

@Controller('users')
export class UserController {
    constructor(private findUserByPhoneNumberUseCase: FindUserByPhoneNumberUseCase) { }

    @Get('/phone/:phone')
    findByPhone(@Param('phone') phone: string) {
        return this.findUserByPhoneNumberUseCase.execute(phone);
    }
}