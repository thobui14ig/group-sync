import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PostSummary } from 'src/application/sync-new-post-group/sync-new-post-group.usecase.i';


export interface Message extends PostSummary { }

interface IClientSocketUser {
  phone: string;
  socketId: string
}

@WebSocketGateway({
  cors: true,
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  posts: Message[] = []

  constructor() { }
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Socket.IO server initialized');
  }

  async handleConnection(client: Socket) {
    console.log('Connection!')
    const phone = client.handshake?.query?.phone as string;

    if (phone) {
      console.log('Connection!')
      return
    }
    console.log('ko tim thay phone')
    return client.disconnect();
  }

  handleDisconnect(client: Socket) {
    console.log('Ngat ket noi!.', client.id);
  }

  async receiveMessage(payload: Message) {
    void this.server.emit('postMessage', payload);
    if (this.posts.length === 30) {
      this.posts.pop
    }
    this.posts.unshift(payload);
    this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
