
import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import fetch from 'node-fetch';
import { delay, getHttpAgent } from 'src/common/helper';
import { ProxyEntity, ProxyStatus } from 'src/infrastructure/entity/proxy.entity';
import { GroupRepository } from 'src/infrastructure/repository/user/group.repository';
import { ProxyRepository } from 'src/infrastructure/repository/user/proxy.repository';
import { AppGateway } from 'src/infrastructure/socket/app.gateway';
import { faker } from '@faker-js/faker';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { writeFile } from 'src/common/file';
const cheerio = require('cheerio');
dayjs.extend(utc);

@Injectable()
export class SyncNewPostGroupUseCase {
    groupIdsRunning: string[] = []
    proxy: ProxyEntity = null
    fbGraphql = `https://www.facebook.com/api/graphql`;
    proxyDefault1: ProxyEntity = {
        id: -1,
        value: "103.245.245.155:4146:demarcus74352:mzuxmjywotyz",
        status: ProxyStatus.ACTIVE
    }
    proxyDefault2: ProxyEntity = {
        id: -2,
        value: "103.245.245.155:4146:demarcus74352:mzuxmjywotyz",
        status: ProxyStatus.ACTIVE
    }
    arrRemove = ["Nhận", "Cam kết", "Hỗ trợ", "nhu cầu", "✅", "Nhận Thiết Kế", "Chào mừng", "Thứ Hạng"]
    private readonly logger = new Logger(SyncNewPostGroupUseCase.name);

    constructor(
        private readonly gateway: AppGateway,
        private readonly groupRepository: GroupRepository,
        private readonly httpService: HttpService
    ) {
        this.proxy = this.proxyDefault1
    }

    async execute() {
        const allGroupStart = (await this.groupRepository.find()).map(item => item.groupId)
        const groupIdsRunning = new Set(this.groupIdsRunning);
        const groupIdsShouldStart = allGroupStart.filter(item => !groupIdsRunning.has(item));
        this.groupIdsRunning = allGroupStart;
        const postHandle = groupIdsShouldStart.map((groupId) => {
            return this.crawlPublic(groupId)
        })
        return Promise.all([...postHandle])
    }

    async crawlPublic(groupId: string) {
        while (true) {
            try {
                const isExist = this.groupIdsRunning.includes(groupId)

                if (!isExist) break;
                // this.logger.debug(`Start crawl post with groupId: ${groupId}`)
                // const proxy = await this.proxyRepository.getRandomProxy()
                // if (!proxy) continue;
                const httpsAgent = getHttpAgent(this.proxy)

                await fetch(`https://www.facebook.com/groups/${groupId}/?sorting_setting=CHRONOLOGICAL`, {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "vi,en-US;q=0.9,en;q=0.8",
                        "cache-control": "max-age=0",
                        "dpr": "1.1",
                        "priority": "u=0, i",
                        "sec-ch-prefers-color-scheme": "light",
                        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
                        "sec-ch-ua-full-version-list": "\"Not)A;Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"138.0.7204.158\", \"Google Chrome\";v=\"138.0.7204.158\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-model": "\"\"",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-ch-ua-platform-version": "\"10.0.0\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1",
                        "viewport-width": "860",
                        "cookie": "sb=IpN2Z63pdgaswLIv6HwTPQe2; ps_l=1; ps_n=1; vpd=v1%3B896x414x2; datr=VbQ5aIRhuL3sZgH-YD17GNjn; wl_cbv=v2%3Bclient_version%3A2856%3Btimestamp%3A1751184877; locale=vi_VN; m_pixel_ratio=2; dpr=1.100000023841858; c_user=100018203168307; i_user=61578848633136; fr=1hZBgwkwPBvSXrzsx.AWc3L-TVmzgSrjB-gJ4wwL2GxfJuPboU81IkB_Xze_jiSUSYLEA.BogK8Z..AAA.0.0.BogK8Z.AWf82Ly3Afo7Yh0lsZjebqMecDw; xs=42%3ABdW4Aoqw-18uaQ%3A2%3A1753262224%3A-1%3A-1%3A%3AAcVYS8o0xbplVxcb8eYjF6tftHHCkaOqrdICVqGbNA; wd=860x866"
                    },
                    "body": null,
                    "method": "GET"
                })
                    .then(async (response) => {
                        const text = await response.text();
                        const p = this.getPostId(text)
                        const m = this.getMessage(text)
                        let i = this.getUserId(text)
                        let n = this.getName(text)

                        if (!m || m?.length === 0) return
                        if ((!n || n?.length === 0)) {
                            n = "Người tham gia ẩn danh"
                            i = null;
                        }
                        const isRemove = this.remove(m)

                        if (isRemove) {
                            return
                        }

                        const message = {
                            actorId: i,
                            actorName: n,
                            postId: p,
                            content: m,
                            createdAt: dayjs().utc().format('YYYY-MM-DD HH:mm:ss'),
                            groupId
                        }
                        console.log("🚀 ~ SyncNewPostGroupUseCase ~ .then ~ message:", message)
                        return this.gateway.receiveMessage(message)

                        // if (typeof text === 'string') {
                        //     const lines = text.trim().split('\n');
                        //     const dataJson = JSON.parse(lines[0])
                        //     const responsePost = dataJson?.data?.node?.group_feed?.edges[0].node
                        //     const actorId = responsePost?.["actors"]?.[0]?.["id"]
                        //     const actorName = responsePost?.["actors"]?.[0]?.["name"]
                        //     const postId = responsePost?.["post_id"]
                        //     const content = responsePost?.["comet_sections"]?.["content"]?.["story"]?.["comet_sections"]?.["message"]?.["story"]?.["message"]?.["text"]
                        //     const createdAt = dayjs.unix(responsePost?.["comet_sections"]?.["timestamp"]?.["story"]?.["creation_time"]).utc().format('YYYY-MM-DD HH:mm:ss');

                        //     // if (dataJson?.errors?.[0]?.code === 1675004 && this.proxy.id !== -1) {
                        //     //     this.proxy.status = ProxyStatus.IN_ACTIVE
                        //     //     return this.proxyRepository.update(this.proxy)
                        //     // }
                        //     const message = {
                        //         actorId,
                        //         actorName,
                        //         postId,
                        //         content,
                        //         createdAt,
                        //         groupId
                        //     }
                        //     const isRemove = this.remove(message.content)

                        //     if (isRemove) {
                        //         return
                        //     }
                        //     console.log("🚀 ~ SyncNewPostGroupUseCase ~ .then ~ message:", message)

                        //     if (actorId && actorName && postId && content) {
                        //         const key = `${groupId}_${createdAt.replaceAll("-", "").replaceAll(" ", "").replaceAll(":", "")}`
                        //         const isExistKey = await this.redisService.checkAndUpdateKey(key)
                        //         if (!isExistKey) {
                        //             return this.gateway.receiveMessage(message)
                        //         }
                        //     }
                        // }
                    })
                    .catch(async (error) => {
                        if (this.proxy.id == -1) {
                            this.proxy = this.proxyDefault2
                        } else {
                            this.proxy = this.proxyDefault1
                        }

                    });
            } catch (error) { } finally {
                await delay(20000)

            }
        }
    }

    getName(inputString) {
        let content = ''
        const regexPattern = /<strong[^>]*class="[^"]*\bhtml-strong\b[^"]*"[^>]*>.*?<span[^>]*class="[^"]*\bhtml-span\b[^"]*"[^>]*>(.*?)<\/span>.*?<\/strong>/;

        // Sử dụng hàm match để tìm kiếm và trả về kết quả
        const match = inputString.match(regexPattern);

        // Nếu match trả về một mảng và có ít nhất một kết quả
        if (match && match.length > 1) {
            content = match[1]; // Lấy nội dung từ capture group thứ nhất
        }

        return content
    }

    getMessage(inputString) {
        const regex2 = /<div class="xdj266r x14z9mp xat24cr x1lziwak x1vvkbs x126k92a">(.*?)<\/div>/g;
        const match1 = inputString.match(regex2);
        if (match1) {
            return match1[0]
        }
        const regex = /<div class="xdj266r x14z9mp xat24cr x1lziwak x1vvkbs">(.*?)<\/div>/g;
        const match = inputString.match(regex);

        let message = ''

        if (match) {
            return match[0]
        }


        if (message.length === 0) {
            message = this.getMessage2(inputString)
        }

        return message?.replace('</div>', '');
    }

    getMessage2(inputString) {
        const $ = cheerio.load(inputString);
        const content = $('.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1vvkbs.x126k92a').html();

        return content;
    }

    getUserId(inputString) {
        const regex = /\\"actor_id\\":\\"(\d+)\\"/;
        const matches = inputString.match(regex);
        if (matches && matches.length > 1) {
            const actorIdValue = matches[1];

            return actorIdValue
        }

        return null;
    }


    getPostId(inputString) {
        const regex = /"subscription_target_id":"(\d+)"/;
        const matches = inputString.match(regex);

        if (matches && matches.length > 1) {
            const postIdValue = matches[1];
            return postIdValue;
        } else {
            return null;
        }
    }

    remove(content: string) {
        let isRemove = false;
        for (const element of this.arrRemove) {
            if (content?.toLocaleLowerCase().includes(element.toLocaleLowerCase())) {
                isRemove = true

                break;
            }
        }

        return isRemove
    }

    async crawlPrivate(groupId: string) {
        while (true) {
            try {
                const isExist = this.groupIdsRunning.includes(groupId)

                if (!isExist) break;
                // this.logger.debug(`Start crawl post with groupId: ${groupId}`)
                const httpsAgent = getHttpAgent(this.proxy)
                const languages = [
                    'en-US,en;q=0.9',
                    'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                    'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
                ];

                const userAgent = faker.internet.userAgent()
                const apceptLanguage = languages[Math.floor(Math.random() * languages.length)]



                const res = await firstValueFrom(
                    this.httpService.get(`https://graph.facebook.com/1671812873703572/feed?limit=10&&fields=id,created_time,updated_time,message&access_token=EAABsbCS1iHgBPBZA83BVFwzyNf2PqS2vOloPy4d5cBNiw4vXY2K0oZBZCKswCjtTuAGk9UyNOxdw6UrLZB4mtpIMFvJKahIbJh08DfrcAl9qAJqZCXZC6xvbLXmDMvecXzVbY17JeXyDeAZCZAZCP54ZAZBTBX7zrRJja7P9BVdyk27UeE7Je1E8Vl5RwrARGQqhjslUAZDZD`, {
                        // httpsAgent,
                        // params
                    }),
                );
                // const latestPost = res.data.data.reduce((latest, post) => {
                //     return new Date(post.created_time) > new Date(latest.created_time) ? post : latest;
                // });
                console.log("🚀 ~ SyncNewPostGroupUseCase ~ crawlPrivate ~ res:", res.data.data[0])

            } catch (error) {
                console.log("🚀 ~ SyncNewPostGroupUseCase ~ crawlPrivate ~ error:", error?.response?.data?.error)
            } finally {
                await delay(20000)
            }
        }
    }
}