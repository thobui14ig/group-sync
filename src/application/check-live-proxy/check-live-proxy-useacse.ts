import { Injectable, Logger } from "@nestjs/common";
import { getHttpAgent } from "src/common/helper";
import { ProxyEntity, ProxyStatus } from "src/infrastructure/entity/proxy.entity";
import fetch from 'node-fetch';
import { ProxyRepository } from "src/infrastructure/repository/user/proxy.repository";
import { faker } from '@faker-js/faker';
const proxy_check = require('proxy-check');

@Injectable()
export class CheckLiveProxyUseCase {
    private readonly logger = new Logger(CheckLiveProxyUseCase.name);
    fbGraphql = `https://www.facebook.com/api/graphql`;

    constructor(
        private proxyRepository: ProxyRepository,
    ) { }

    async execute() {
        const proxies = await this.proxyRepository.find()

        for (const proxy of proxies) {
            const [host, port, username, password] = proxy.value.split(':');
            const config = {
                host,
                port,
                proxyAuth: `${username}:${password}`
            };
            proxy_check(config).then(async (res) => {
                if (res) {
                    const isBlock = await this.check(proxy)

                    if (isBlock) {
                        proxy.status = ProxyStatus.IN_ACTIVE
                        return this.proxyRepository.update(proxy)
                    }

                    proxy.status = ProxyStatus.ACTIVE
                    return this.proxyRepository.update(proxy)
                }
            }).catch(async (e) => {
                proxy.status = ProxyStatus.IN_ACTIVE
                return this.proxyRepository.update(proxy)
            });
        }
    }

    async check(proxy: ProxyEntity) {
        try {
            const httpsAgent = getHttpAgent(proxy)
            const groupId = '4201081250118999'
            const languages = [
                'en-US,en;q=0.9',
                'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
            ];

            const userAgent = faker.internet.userAgent()
            const apceptLanguage = languages[Math.floor(Math.random() * languages.length)]
            return fetch(this.fbGraphql, {
                agent: httpsAgent,
                "headers": {
                    "accept": "*/*",
                    "content-type": "application/x-www-form-urlencoded",
                    "priority": "u=1, i",
                    "sec-ch-prefers-color-scheme": "light",
                    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                    "sec-ch-ua-full-version-list": "\"Not)A;Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"138.0.7204.49\", \"Google Chrome\";v=\"138.0.7204.49\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-model": "\"\"",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-ch-ua-platform-version": "\"10.0.0\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-asbd-id": "359341",
                    "x-fb-friendly-name": "GroupsCometFeedRegularStoriesPaginationQuery",
                    "x-fb-lsd": "iNntNFIzuOMNQPY0iO68Cq",
                    'user-agent': userAgent,
                    'accept-language': apceptLanguage,
                },
                "body": `av=0&__aaid=0&__user=0&__a=1&__req=e&__hs=20267.HYP%3Acomet_loggedout_pkg.2.1...0&dpr=1&__ccg=EXCELLENT&__rev=1024289552&__s=14zl0a%3A5ga8mn%3Ao10q0p&__hsi=7520901207584584861&__dyn=7xeUjG1mxu1syaxG4Vp41twWwIxu13wsongS3q32360CEboG0x8bo6u3y4o2Gw6QCwjE1EEc87m0yE462mcwfG12wOx62G3i0Bo7O2l0Fwqo31w9a9wlo5qfK0zEkxe2GewbS2SU4i5oe8464-5pUfEe88o4Wm7-0im3G2-azqwc-3908O3216xi4UdUbGwLwFg2Xwkoqwqo4eEgwro-12BU-6awIK6E4-8wLwHwea1wweW2K3a&__csr=gdfs54Igy8AHEySAZ8ikDObunAJrWiKqGyUlahOWgxdkiBXQWXAUyKt4Gq-LlRF9da22Smihe9ypA9DBgFHAVnjQUPXzaKm9yktrAG44jXh8TCGh58KpKm8xiiqeCxWuuu8AVkleUKaCzoF5GivGqu2Cuvy98gxqF4mh28iAz84eHCw_xyUiwle0gK5o0xajh5Rx3wxG3e0gWowYiewMA-Eiykl0f-220IUa-RKibH_wMw4JxyE0CW2S7Ec80rzUjgS682ow10G2e04HhguwqQ1KxN2U0K0w882owwwuorwxAEJwuFbwo80_-1cweziwno4Tw4oIw5S9goyE2zw6ky80CW9wmEbEgBG9woo88ig4Su1TwnU4O2W8wEw0tfvCxG9w9500C-gC0heLWwSG016Rxm0kq0K816U41a646-1zwau0H8bE1C8BjwdO5Ex2t2o0wm7UO2aFEhw8OeEw18m0h8Gxxxgy7jwIU2ywHwwwk88U5QwS8Nsmm5k0DE4u3Vwn8G0vwEnxO5GwSxO2W0CU5S1Go0wi0lm2G3Qw3PC0xNceB8V2XA8WAq8gYmLbTic3EgAbgW3kE9bm0Co6-aVE2bwonw6bc0x85em3y1exCl0l82bwGw9y1jwgA1pFdhbC4KAPEKA_hs83UbS0-pE2HgC0gecggzu3V3ElzGyU3Dw3m87i9w4Cy8P384a3MM21wmEnwNweu0_9yzUK43w4GxIEv4163hzQQi6cdB_GBc0w836zx0aEK0zEGbz5w6VDGubgtr2e1wwVw1BC040Eb8fomG0jm-0yU2tg0BS0pK8sw2Dw8y781iE8EO1ww2ioS8o3QwEgaEqxC225oicK17www-grw5Ug3dwgUy0B0ADjypcEsxx0lo1YU1z42e1RwZD95F4DUx1L50UBc0Kk1Jw7dof6740nO0t62C6U6e0C48BwqEgwOxi5E9K2K8o34o1OEayyKEN0FAOwdyS3i0BU&__hsdp=gwkcpdiMcAbEbNZhDbbqq4R8gi4K4YulN48gcr5h5ekVF0pmhyLxmNOrpTgOcyQ9ehdxNeckOgqoaEZmUW6t6jghByEixat5K4lDyoPKCQawOxl2kE8R2b4EgczVBjNo9ik5Aq12xYwpeEugO9wYpEtgKbzUdAawzwl8jz8562Vu4l4tOlE8NcGnOYXf4Ehbky5ivbu7rBjBKHvDx2mC9GGz8By9uEhCAzKEy0maqE2Kwo41Lg4em8yLGV25878mWFGGZ4kGCi8igGRxam4oaUqwPwa9osxS78jAwl88poK2Om3O4EC3G58d9E4C0DUepo4S3G6UO6EG4ofE4q5U-3idooy9Enz8dFEG4ocA2226axO3qbhUb88Usxe2-1ywsFWXBKAjHkFO4Vk8jjK2icyaxuaxS10mcyJ3d1uV83qwygoQ54cGuawFxS1ayFEC6EC262a48eEfo4e2K1nxu4o6W2G&__hblp=0uU1ebgrAwqUqwXxu1nzU4W0yofEswoEdorw8K12wsE3Zwq84a6U4a0MHBwppob83cwbp04pwbmez8ydw864FohDwzxG3e58aoixu0WEmwxw-BxWq0Mo4u15w8G1py8d8a8ydzpFojDChU8ob8gxG3e6Uyp1ScCG9wi8hxim6889orwgU9Ey4oqx24Ec9Ea8OE5a4EnGayu0S8C2qq3WEak220SE8EcoSHzEqwIxK7orwlUgx7xK482awTg4O4o5R0FwHBcU&__comet_req=15&fb_dtsg=g7c74EoVS2w%3D&jazoest=2943&lsd=iNntNFIzuOMNQPY0iO68Cq&__spin_r=1024289552&__spin_b=trunk&__spin_t=1751096269&__crn=comet.fbweb.CometGroupDiscussionRoute&qpl_active_flow_ids=431626709&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=GroupsCometFeedRegularStoriesPaginationQuery&variables=%7B%22count%22%3A3%2C%22cursor%22%3A%22AQHRwHRLBbaDPVSMI6fxTXmpcctYmDTfuLdcBb0YWv7HLmVO5jRPdu9A1iOg9tDpWbhP-gQt4KdHUFrotJZ01Ypg1wwZXl_OvvXhwM6mzBhDpZhcyHv-QOKzcT6F6w44EteR6-5uY01FvL3UBGjAyifK4qeOhFuaaNhaqBcmE9GSI50:eyIwIjoxNzUxMDk3MTUxLCIxIjo3NjgyLCIzIjowLCI0IjoxLCI1IjoyLCI2IjotMX0=%3D%3D%22%2C%22feedLocation%22%3A%22GROUP%22%2C%22feedType%22%3A%22DISCUSSION%22%2C%22feedbackSource%22%3A0%2C%22focusCommentID%22%3Anull%2C%22privacySelectorRenderLocation%22%3A%22COMET_STREAM%22%2C%22renderLocation%22%3A%22group%22%2C%22scale%22%3A1%2C%22sortingSetting%22%3A%22CHRONOLOGICAL%22%2C%22stream_initial_count%22%3A1%2C%22useDefaultActor%22%3Afalse%2C%22id%22%3A%22${groupId}%22%2C%22__relay_internal__pv__GHLShouldChangeAdIdFieldNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__GHLShouldChangeSponsoredDataFieldNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__IsWorkUserrelayprovider%22%3Afalse%2C%22__relay_internal__pv__FBReels_deprecate_short_form_video_context_gkrelayprovider%22%3Afalse%2C%22__relay_internal__pv__FeedDeepDiveTopicPillThreadViewEnabledrelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider%22%3Afalse%2C%22__relay_internal__pv__WorkCometIsEmployeeGKProviderrelayprovider%22%3Afalse%2C%22__relay_internal__pv__IsMergQAPollsrelayprovider%22%3Afalse%2C%22__relay_internal__pv__FBReelsMediaFooter_comet_enable_reels_ads_gkrelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider%22%3Afalse%2C%22__relay_internal__pv__CometUFIShareActionMigrationrelayprovider%22%3Atrue%2C%22__relay_internal__pv__CometUFI_dedicated_comment_routable_dialog_gkrelayprovider%22%3Afalse%2C%22__relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider%22%3Afalse%2C%22__relay_internal__pv__FBReelsIFUTileContent_reelsIFUPlayOnHoverrelayprovider%22%3Afalse%7D&server_timestamps=true&doc_id=24452415454343849`,
                "method": "POST",
            })
                .then(async (response) => {
                    const text = await response.text();
                    if (typeof text === 'string') {
                        const lines = text.trim().split('\n');
                        const dataJson = JSON.parse(lines[0])

                        if (dataJson?.errors?.[0]?.code === 1675004) {
                            return true
                        }

                    }
                    return false
                })
                .catch((error) => {
                    this.logger.error(JSON.stringify(error))
                    return false
                });
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            return false
        }
    }
}