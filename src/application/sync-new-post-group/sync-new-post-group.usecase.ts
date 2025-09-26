
import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import fetch from 'node-fetch';
import { delay, getHttpAgent } from 'src/common/helper';
import { HttpService } from '@nestjs/axios';
import { GroupRepository } from 'src/infrastructure/repository/group.repository';
import { ProxyRepository } from 'src/infrastructure/repository/proxy.repository';
dayjs.extend(utc);

@Injectable()
export class SyncNewPostGroupUseCase {
    groupIdsRunning: string[] = []
    fbGraphql = `https://www.facebook.com/api/graphql`;
    arrRemove = ['📣', "phù hợp", "👉", "📌", "👌", "☎️", "𝐇𝐨𝐭𝐥𝐢𝐧𝐞", "cho thuê", "chỉ từ", "ưu đãi", "𝐂𝐡𝐮𝐲𝐞̂𝐧"]
    constructor(
        private readonly groupRepository: GroupRepository,
        private readonly proxyRepository: ProxyRepository,
        private readonly httpService: HttpService
    ) { }

    private readonly logger = new Logger(SyncNewPostGroupUseCase.name);

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
        console.log(groupId)
        while (true) {
            try {
                const isExist = this.groupIdsRunning.includes(groupId)

                if (!isExist) break;
                const proxy = "ip.mproxy.vn:12289:thobui1996:83rvNFb5zPJv3xf"
                const httpsAgent = getHttpAgent(proxy)
                const bodyObject = {
                    variables: JSON.stringify({
                        count: 3,
                        cursor: "AQHRwHRLBbaDPVSMI6fxTXmpcctYmDTfuLdcBb0YWv7HLmVO5jRPdu9A1iOg9tDpWbhP-gQt4KdHUFrotJZ01Ypg1wwZXl_OvvXhwM6mzBhDpZhcyHv-QOKzcT6F6w44EteR6-5uY01FvL3UBGjAyifK4qeOhFuaaNhaqBcmE9GSI50:eyIwIjoxNzUxMDk3MTUxLCIxIjo3NjgyLCIzIjowLCI0IjoxLCI1IjoyLCI2IjotMX0==",
                        sortingSetting: "CHRONOLOGICAL",
                        stream_initial_count: 1,
                        useDefaultActor: false,
                        id: groupId,
                    }),
                    doc_id: "24452415454343849"
                };


                await fetch(this.fbGraphql, {
                    agent: httpsAgent,
                    "headers": {
                        "content-type": "application/x-www-form-urlencoded"
                        
                    },
                    body: new URLSearchParams(bodyObject).toString(),
                    "method": "POST",
                })
                    .then(async (response) => {
                        const text = await response.text();
                        if (typeof text === 'string') {
                            const lines = text.trim().split('\n');
                            const dataJson = JSON.parse(lines[0])
                            const responsePost = dataJson?.data?.node?.group_feed?.edges[0].node
                            const actorId = responsePost?.["actors"]?.[0]?.["id"]
                            const actorName = responsePost?.["actors"]?.[0]?.["name"]
                            const postId = responsePost?.["post_id"]
                            const content = responsePost?.["comet_sections"]?.["content"]?.["story"]?.["comet_sections"]?.["message"]?.["story"]?.["message"]?.["text"]
                            const createdAt = dayjs.unix(responsePost?.["comet_sections"]?.["timestamp"]?.["story"]?.["creation_time"]).utc().format('YYYY-MM-DD HH:mm:ss');
                            if (dataJson?.errors?.[0]?.code === 1675004) {
                                // proxy.status = ProxyStatus.IN_ACTIVE
                                // return this.proxyRepository.update(proxy)
                                console.log(dataJson?.errors)
                                return null
                            }
       
                            if((content??"").length > 0 && !this.exclude(content)){
                                const message = {
                                    actorId,
                                    actorName,
                                    postId,
                                    content,
                                    createdAt,
                                    groupId
                                }
                                console.log(message)                                
                            }

                        }
                    })
                    .catch((error) => {
                        console.log("🚀 ~ SyncNewPostGroupUseCase ~ crawl ~ error:", error.message)
                    });
            } catch (error) {
                this.logger.error(JSON.stringify(error))
            } finally {
                await delay(5000)
            }
        }
    }

    exclude(content: string) {
        let isRemove = false;
        for (const element of this.arrRemove) {
            if (this.normalize(content)?.toLocaleLowerCase().includes(element.toLocaleLowerCase())) {
                isRemove = true

                break;
            }
        }

        return isRemove
    }

    normalize(str) {
        return str
            ?.normalize("NFC")                  // chuẩn hóa Unicode
            .replace(/\s+/g, " ")               // gom các loại khoảng trắng về space chuẩn
            .trim()
            .toLowerCase();
    }
}