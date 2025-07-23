import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class RotateProxyUseCase {
    private readonly logger = new Logger(RotateProxyUseCase.name);
    constructor() { }

    async execute() {
        this.logger.log("---------------------------------------------3333333333333333333333333333333333333333Rotate:")
        const res1 = await fetch("https://api-proxy.homeproxy.vn/v1/users/demarcus74352/rotate?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbWFyY3VzNzQzNTIiLCJwYXNzd29yZCI6Im16dXhtanl3b3R5eiIsInBvcnQiOjQxNDYsImlhdCI6MTc1MzI1MjkzMSwiZXhwIjoxNzUzMzM4Mjg5fQ.glGtoCDVnZpPdQwGSOuJLe_zwbcrkdfMeJin5OiRIfE")

        const res2 = await fetch("https://api-proxy.homeproxy.vn/v1/users/salvadorfeil316/rotate?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbHZhZG9yZmVpbDMxNiIsInBhc3N3b3JkIjoiVGhhbmh0aG85NkAiLCJwb3J0Ijo0MTcyLCJpYXQiOjE3NTMyNTI5NDEsImV4cCI6MTc1MzMyNTQyMX0.W5OECxeywkbrPCTT7w6cSjcRjti2UIT8cuXu5sU1rj4")
    }
}