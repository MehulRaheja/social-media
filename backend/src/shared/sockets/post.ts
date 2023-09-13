// we will directly send data to the user, so that user don't have to wait for data to get saved on redis and mongodb
import { Server, Socket } from 'socket.io';

// we will emit event of post from this object
let socketIOPostObject: Server;

export class SocketIOPostHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOPostObject = io;
  }

  // we will not emit event of post from this class instead use the above object 'socketIOPostObject'
  public listen(): void {
    // whatever event we want to use it needs to be add inside this connection
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.io.on('connection', (socket: Socket) => {
      console.log('Post socketio handler');
    });
  }
}
