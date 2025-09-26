import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { io } from "socket.io-client";

@Injectable()
export class SocketService {
    socket1: any = null;

    constructor(private configService: ConfigService) {
        const ip = this.configService.get<string>('IP_SOCKET')
        const port = this.configService.get<string>('PORT_SOCKET')
        const url = `http://${ip}:${port}`
        this.socket1 = this.createSocket(url)
    }

    emit(key: string, payload: any) {
        this.socket1.emit(key, payload)
    }

    createSocket(url: string) {
        const socket = io(url, {
            secure: true,
        })
        socket.on('connect', () => {
            console.log('Connected to server admin page!.')
        })
        socket.on('error', (error) => {
            console.error('Socket connection error:', error)
        })
        socket.on('disconnect', () => {
            console.log('Disconnected from socket')
        })

        return socket
    }
}