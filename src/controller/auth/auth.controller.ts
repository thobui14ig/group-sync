import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { LoginDto } from './auth.controller.i';
import { Response } from 'express';
import { LoginUseCase } from 'src/application/login/login-usecase';

@Controller('auth')
export class AuthController {
    constructor(private loginUseCase: LoginUseCase) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Body() signInDto: LoginDto,
        @Res()
        res: Response,
    ) {
        const { accessToken, refreshToken } = await this.loginUseCase.execute(
            signInDto.phone,
            signInDto.password,
        );

        res.setHeader('Set-Cookie', [`token=${accessToken}; HttpOnly; Path=/`]);

        return res.send({ refreshToken });
    }
}