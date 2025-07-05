import { HttpException, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { UserRepository } from "src/infrastructure/repository/user/user.repository";

@Injectable()
export class LoginUseCase {
    constructor(
        private jwtService: JwtService,
        private userRepository: UserRepository,
    ) { }

    private readonly logger = new Logger(LoginUseCase.name);

    async execute(phone: string, pass: string) {
        const user = await this.userRepository.findByPhone(phone)

        if (user) {
            const currentUser = user

            if (currentUser?.password !== pass) {
                throw new HttpException('Mật khẩu không đúng', 403)
            }

            const payload = { userId: currentUser.id, phone: currentUser.phoneNumber };

            return this.createToken(payload);
        }

        throw new HttpException('Tên tài khoản không đúng', 403)


    }

    async createToken(payload: { phone: string; userId: number; }) {
        return {
            accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: '1d',
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
            }),
        };
    }

    async refreshToken(oldRefreshToken: string, res: Response) {
        try {
            const decodedToken = this.jwtService.verify(oldRefreshToken);
            const refreshTokenExp = decodedToken.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > refreshTokenExp) {
                return res.status(402).json({ refresh: false });
            }

            const payload = {
                userId: decodedToken.userId,
                phone: decodedToken.phone,
                type: 'web',
            };
            const { accessToken, refreshToken } = await this.createToken(payload);

            res.setHeader('Set-Cookie', [`token=${accessToken}; HttpOnly; Path=/`]);

            return res.send({ refreshToken });
        } catch (error) {
            return res.status(402).json({ message: 'Refresh token đã hết hạn' });
        }
    }
}