import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginUseCaseModule } from 'src/application/login/login-usecase.module';

@Module({
    imports: [LoginUseCaseModule],
    controllers: [AuthController],
    providers: [],
})
export class AuthControllerModule { }