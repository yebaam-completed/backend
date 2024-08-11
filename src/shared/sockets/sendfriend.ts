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


      socket.on('removeFriend', (data) => {
        this.io.to(data.friendId).emit('friendRemoved', data);
      });

      socket.on('friendRequestSeen', (data) => {
        this.io.to(data.senderId).emit('friendRequestSeenByReceiver', data);
      });

      socket.on('friendRequestError', (data) => {
        this.io.to(data.userId).emit('friendRequestErrorOccurred', data);
      });

      socket.on('friendRequestStatusUpdate', (data) => {
        this.io.to(data.userId).emit('friendRequestStatusUpdated', data);
      });

      socket.on('cancelFriendRequest', (data) => {
        this.io.to(data.receiverId).emit('friendRequestCancelled', data);
      });
      
      
      
      
      
    });
  }
}
