/* eslint-disable @typescript-eslint/no-explicit-any */
import { ILogin, ISocketData } from '@user/interfaces/user.interface';
import { Server, Socket } from 'socket.io';

export let socketIOUserObject: Server;
export const connectedUsersMap: Map<string, string> = new Map();
export const friendRequestsMap: Map<string, string> = new Map();

let users: string[] = [];

export class SocketIOUserHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOUserObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('setup', (data: ILogin) => {
        this.addClientToMap(data.userId, socket.id);
        this.addUser(data.userId);
        this.io.emit('user online', users);
      });

      socket.on('block user', (data: ISocketData) => {
        this.io.emit('blocked user id', data);
      });

      socket.on('unblock user', (data: ISocketData) => {
        this.io.emit('unblocked user id', data);
      });

      // Evento para enviar solicitud de amistad
      socket.on('send friend request', (data: { sender: string; receiver: string }) => {
        this.sendFriendRequest(data.sender, data.receiver);
      });

      // Evento para aceptar solicitud de amistad
      socket.on('accept friend request', (data: { sender: string; receiver: string }) => {
        this.acceptFriendRequest(data.sender, data.receiver);
      });

      // Evento para rechazar solicitud de amistad
      socket.on('reject friend request', (data: { sender: string; receiver: string }) => {
        this.rejectFriendRequest(data.sender, data.receiver);
      });

      // Evento para eliminar un amigo
      socket.on('remove friend', (data: { userId: string; friendId: string }) => {
        this.removeFriend(data.userId, data.friendId);
      });
      socket.on('update profile', (data: { userId: string; newProfileData: any }) => {
        this.updateUserProfile(data.userId, data.newProfileData);
      });

      // Evento para enviar mensajes directos
      socket.on('send direct message', (data: { senderId: string; receiverId: string; message: string }) => {
        this.sendDirectMessage(data.senderId, data.receiverId, data.message);
      });
      // Evento para obtener lista de amigos en línea
      socket.on('get online friends', (data: { userId: string; friendsList: string[] }) => {
        this.getOnlineFriends(data.userId, data.friendsList);
      });

      // nuevos
     // Evento para notificaciones de actividad reciente
     socket.on('notify activity', (data: { userId: string; activity: string }) => {
      this.notifyActivity(data.userId, data.activity);
    });

        // Evento para crear un grupo
        socket.on('create group', (data: { groupId: string; groupName: string; creatorId: string }) => {
          this.createGroup(data.groupId, data.groupName, data.creatorId);
        });

        
      // Evento para añadir un miembro a un grupo
      socket.on('add member to group', (data: { groupId: string; memberId: string }) => {
        this.addMemberToGroup(data.groupId, data.memberId);
      });

      
      // Evento para enviar invitaciones a eventos
      socket.on('send event invitation', (data: { eventId: string; inviteeId: string }) => {
        this.sendEventInvitation(data.eventId, data.inviteeId);
      });

          // Evento para obtener historial de mensajes recientes
          socket.on('get recent messages', (data: { conversationId: string; userId: string }) => {
            this.getRecentMessages(data.conversationId, data.userId);
          });
          
      // Evento para indicadores de escritura
      socket.on('notify typing', (data: { conversationId: string; userId: string }) => {
        this.notifyTyping(data.conversationId, data.userId);
      });
    



      socket.on('disconnect', () => {
        this.removeClientFromMap(socket.id);
      });
    });
  }
// Notificar actividad reciente
private notifyActivity(userId: string, activity: string): void {
  this.io.to(connectedUsersMap.get(userId) || '').emit('activity notification', {
    userId,
    activity,
  });
}

// Crear un grupo
private createGroup(groupId: string, groupName: string, creatorId: string): void {
  this.io.emit('group created', { groupId, groupName, creatorId });
}

// Añadir un miembro a un grupo
private addMemberToGroup(groupId: string, memberId: string): void {
  this.io.emit('member added to group', { groupId, memberId });
}

// Enviar invitaciones a eventos
private sendEventInvitation(eventId: string, inviteeId: string): void {
  this.io.to(connectedUsersMap.get(inviteeId) || '').emit('event invitation', {
    eventId,
    inviteeId,
  });
}

// Obtener historial de mensajes recientes
private getRecentMessages(conversationId: string, userId: string): void {
  // Aquí deberíamos obtener los mensajes de una base de datos o caché
  const recentMessages ='';
  this.io.to(connectedUsersMap.get(userId) || '').emit('recent messages', {
    conversationId,
    messages: recentMessages,
  });
}

// Notificar que alguien está escribiendo
private notifyTyping(conversationId: string, userId: string): void {
  this.io.emit('typing', { conversationId, userId });
}

  private getOnlineFriends(userId: string, friendsList: string[]): void {
    const onlineFriends = friendsList.filter((friend) => connectedUsersMap.has(friend));
    this.io.to(connectedUsersMap.get(userId) || '').emit('online friends', onlineFriends);
  }
  private sendDirectMessage(senderId: string, receiverId: string, message: string): void {
    this.io.to(connectedUsersMap.get(receiverId) || '').emit('direct message', {
      senderId,
      receiverId,
      message
    });
  }
  updateUserProfile(userId: string, newProfileData: any) {
    this.io.emit('profile updated', { userId, newProfileData });
  }
  removeFriend(userId: string, friendId: string) {
    this.io.emit('friend removed', { userId, friendId });
  }
  sendFriendRequest(sender: string, receiver: string) {
    friendRequestsMap.set(sender, receiver);
    this.io.emit('friend request sent', { sender, receiver });
  }
  acceptFriendRequest(sender: string, receiver: string) {
    friendRequestsMap.delete(sender);
    this.io.emit('friend request accepted', { sender, receiver });
  }
  rejectFriendRequest(sender: string, receiver: string) {
    friendRequestsMap.delete(sender);
    this.io.emit('friend request rejected', { sender, receiver });
  }

  private addClientToMap(username: string, socketId: string): void {
    if (!connectedUsersMap.has(username)) {
      connectedUsersMap.set(username, socketId);
    }
  }

  private removeClientFromMap(socketId: string): void {
    if (Array.from(connectedUsersMap.values()).includes(socketId)) {
      const disconnectedUser: [string, string] = [...connectedUsersMap].find((user: [string, string]) => {
        return user[1] === socketId;
      }) as [string, string];
      connectedUsersMap.delete(disconnectedUser[0]);
      this.removeUser(disconnectedUser[0]);
      this.io.emit('user online', users);
    }
  }
  
// users on line
  private addUser(username: string): void {
    users.push(username);
    users = [...new Set(users)];
  }

  private removeUser(username: string): void {
    users = users.filter((name: string) => name != username);
  }
}
