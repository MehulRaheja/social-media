// we will directly send data to the user, so that user don't have to wait for data to get saved on redis and mongodb
import { ICommentDocument } from '@comment/interfaces/comment.interface';
import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { Server, Socket } from 'socket.io';

// we will emit event of post from this object
export let socketIOPostObject: Server;

export class SocketIOPostHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOPostObject = io;
  }

  // we will not emit event of post from this class instead use the above object 'socketIOPostObject'
  public listen(): void {
    // whatever event we want to use it needs to be add inside this connection
    // events emitted here will go to every user
    this.io.on('connection', (socket: Socket) => {
      socket.on('reaction', (reaction: IReactionDocument) => {
        this.io.emit('update like', reaction); // whenever user likes a post we will emit an event and it is going to every user not just a particular socket
      });

      socket.on('comment', (data: ICommentDocument) => {
        this.io.emit('update comment', data);
      });
    });
  }
}
