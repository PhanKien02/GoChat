import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        autoConnect: true,
        timeout: 5000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      this.socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
