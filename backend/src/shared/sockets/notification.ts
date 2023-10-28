// for this we don't need a constructor just pass the io of type server to the object
import { Server } from 'socket.io';

// we will use this object outside this file
let socketIONotificationObject: Server;

export class SocketIONotificationHandler {
  public listen(io: Server): void {
    socketIONotificationObject = io;
  }
}

export { socketIONotificationObject };
