import { io } from 'socket.io-client';

class SocketService {
  socket;

  setupSocketConnection() {
    this.socket = io(process.env.REACT_APP_BASE_ENDPOINT, {
      // WARNING: if transport is websocket then socket has no fallback for long polling, which is the default case
      transports: ['websocket'],
      secure: true
    });
    this.socketConnectionEvents();
  }

  socketConnectionEvents() {
    this.socket.on('connect', () => {
      console.log('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Reason: ${reason}`);
      this.socket.connect(); // If there is a disconnection we will try to reconnect
    });

    this.socket.on('connect_error', (error) => {
      console.log(`Error: ${error}`);
      this.socket.connect(); // If there is an error event then we will try to reconnect
    });
  }
}

export const socketService = new SocketService();
