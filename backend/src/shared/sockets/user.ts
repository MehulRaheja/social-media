// we will directly send data to the user, so that user don't have to wait for data to get saved on redis and mongodb
import { ISocketData } from '@user/interfaces/user.interface';
import { Server, Socket } from 'socket.io';

// we will use this object outside this file
export let socketIOUserObject: Server;

export class SocketIOUserHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOUserObject = io;
  }

  public listen(): void {
    // whatever event we want to use it needs to be add inside this connection
    // events emitted here will go to every user
    this.io.on('connection', (socket: Socket) => {
      socket.on('block user', (data: ISocketData) => {
        this.io.emit('blocked user id', data); // whenever user unfollow we will emit an event and it is going to every user not just a particular socket
      });

      socket.on('unblock user', (data: ISocketData) => {
        this.io.emit('unblocked user id', data); // whenever user unfollow we will emit an event and it is going to every user not just a particular socket
      });
    });
  }
}
