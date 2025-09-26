import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ResetIpMproxyUseCase {

    constructor(
        private readonly httpService: HttpService
    ) { }

    async execute() {
        try {
            return await firstValueFrom(
                this.httpService.get(`https://mproxy.vn/capi/GO3Iqf_-4w729H8skVYYVIgIhsgKC_nn6Po4VrIeEUc/key/83rvNFb5zPJv3xf/resetIp`)
            )     
        } catch (error) {
            console.log('Reset ip mproxy error.')
        }
    }
}