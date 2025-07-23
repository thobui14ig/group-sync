import { HttpsProxyAgent } from "https-proxy-agent";
import { ProxyEntity } from "src/infrastructure/entity/proxy.entity";

function getHttpAgent(proxy: ProxyEntity) {
    const proxyArr = proxy.value.split(':')
    // 
    const agent = `http://${proxyArr[2]}:${proxyArr[3]}@${proxyArr[0]}:${proxyArr[1]}`
    const httpsAgent = new HttpsProxyAgent(agent);

    return httpsAgent;
}

const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { getHttpAgent, delay }