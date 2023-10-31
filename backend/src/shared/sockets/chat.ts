// we will directly send data to the user, so that user don't have to wait for data to get saved on redis and mongodb
import { ISenderReceiver } from '@chat/interfaces/chat.interface';
import { Server, Socket } from 'socket.io';

// we will use this object outside this file
export let socketIOChatObject: Server;

export class SocketIOChatHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOChatObject = io;
  }

  public listen(): void {
    // whatever event we want to use it needs to be add inside this connection
    // events emitted here will go to every user
    this.io.on('connection', (socket: Socket) => {
      socket.on('join room', (data: ISenderReceiver) => {
        console.log(data);
      });
    });
  }
}
