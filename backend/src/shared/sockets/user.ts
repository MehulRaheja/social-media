// we will directly send data to the user, so that user don't have to wait for data to get saved on redis and mongodb
import { ILogin, ISocketData } from '@user/interfaces/user.interface';
import { Server, Socket } from 'socket.io';

// we will use this object outside this file
export let socketIOUserObject: Server;
export const connectedUsersMap: Map<string, string> = new Map(); // it contains the ids of currently active users
let users: string[] = [];

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
      socket.on('setup', (data: ILogin) => {
        this.addClientToMap(data.userId, socket.id);
        this.addUser(data.userId);
      });

      socket.on('block user', (data: ISocketData) => {
        this.io.emit('blocked user id', data); // whenever user unfollow we will emit an event and it is going to every user not just a particular socket
      });

      socket.on('unblock user', (data: ISocketData) => {
        this.io.emit('unblocked user id', data); // whenever user unfollow we will emit an event and it is going to every user not just a particular socket
      });

      socket.on('disconnect', () => {
        this.removeClientFromMap(socket.id); // disconnected users will be removed form connectedUserMap
      });
    });
  }

  private addClientToMap(username: string, socketId: string): void {
    if(!connectedUsersMap.has(username)) {
      connectedUsersMap.set(username, socketId);
    }
  }

  private removeClientFromMap(socketId: string): void {
    if(Array.from(connectedUsersMap.values()).includes(socketId)) {
      const disconnectedUser: [string, string] = [...connectedUsersMap].find((user: [string, string]) => {
        return user[1] === socketId;
      }) as [string, string];
      connectedUsersMap.delete(disconnectedUser[0]);
      this.removeUser(disconnectedUser[0]);
      // send event to the client
      this.io.emit('user online', users);
    }
  }

  private addUser(username: string): void {
    users.push(username);
    users = [...new Set(users)];
  }

  private removeUser(username: string): void {
    users = users.filter((name: string) => name != username);
  }
}
