// we will directly send data to the user, so that user don't have to wait for data to get saved on redis and mongodb
import { IFollowers } from '@follower/interfaces/follower.interface';
import { Server, Socket } from 'socket.io';

// we will use this object outside this file
export let socketIOFollowerObject: Server;

export class SocketIOFollowerHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOFollowerObject = io;
  }

  public listen(): void {
    // whatever event we want to use it needs to be add inside this connection
    // events emitted here will go to every user
    this.io.on('connection', (socket: Socket) => {
      socket.on('unfollow user', (data: IFollowers) => {
        this.io.emit('remove follower', data); // whenever user unfollow we will emit an event and it is going to every user not just a particular socket
      });
    });
  }
}
