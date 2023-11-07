// we will directly send data to the user, so that user don't have to wait for data to get saved on redis and mongodb
import { ISenderReceiver } from '@chat/interfaces/chat.interface';
import { Server, Socket } from 'socket.io';
import { connectedUsersMap } from './user';

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
      socket.on('join room', (users: ISenderReceiver) => { // when user goes to chat page, this event will be triggered
        const { senderName, receiverName } = users;
        const senderSocketId: string = connectedUsersMap.get(senderName) as string;
        const receiverSocketId: string = connectedUsersMap.get(receiverName) as string;
        socket.join(senderSocketId);  // if senderSocketId and receiverSocketId bot exists then socket.join method will be called upon them
        socket.join(receiverSocketId);
      });
    });
  }
}
