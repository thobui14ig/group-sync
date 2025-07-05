import { Module } from '@nestjs/common';
import { LoginUseCase } from './login-usecase';
import { JwtModule } from '@nestjs/jwt';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';
export const jwtConstants = {
    secret:
        'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
        }),
        RepositoryModule
    ],
    controllers: [],
    providers: [LoginUseCase],
    exports: [LoginUseCase],
})
export class LoginUseCaseModule { }