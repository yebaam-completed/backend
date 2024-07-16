/* eslint-disable @typescript-eslint/no-explicit-any */

import { Server, Socket } from 'socket.io';

export class FriendRequestSocket {
  constructor(private io: Server) {}

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('newFriendRequest', (data) => {
        this.io.to(data.receiverId).emit('friendRequestReceived', data);
      });

      socket.on('friendRequestAccepted', (data) => {
        this.io.to(data.senderId).emit('friendRequestAccepted', data);
      });

      socket.on('friendRequestRejected', (data) => {
        this.io.to(data.senderId).emit('friendRequestRejected', data);
      });
    });
  }
}
