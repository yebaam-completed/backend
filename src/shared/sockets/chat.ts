// socketIOChatHandler.ts
import { ISenderReceiver } from '@chat/interfaces/chat.interface';
import { Server, Socket } from 'socket.io';
import { connectedUsersMap } from '../../modules/user/socket/user';

export let socketIOChatObject: Server;

export class SocketIOChatHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOChatObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      // Evento para unirse a una sala de chat
      socket.on('join room', (users: ISenderReceiver) => {
        const { senderName, receiverName } = users;
        const senderSocketId: string = connectedUsersMap.get(senderName) as string;
        const receiverSocketId: string = connectedUsersMap.get(receiverName) as string;
        socket.join(senderSocketId);
        socket.join(receiverSocketId);
      });

      // Evento para buscar usuarios
      socket.on('search users', (query: string) => {
        this.searchUsers(query);
      });

      // Evento para establecer estado personalizado
      socket.on('set custom status', (data: { userId: string; status: string }) => {
        this.setCustomStatus(data.userId, data.status);
      });

      // Evento para eliminar mensaje solo para el usuario
      socket.on('delete message for me', (data: { userId: string; messageId: string }) => {
        this.deleteMessageForMe(data.userId, data.messageId);
      });

      // Evento para eliminar mensaje para todos
      socket.on('delete message for everyone', (data: { conversationId: string; messageId: string }) => {
        this.deleteMessageForEveryone(data.conversationId, data.messageId);
      });

      // Evento para reportar abuso
      socket.on('report abuse', (data: { userId: string; reportedId: string; message: string }) => {
        this.reportAbuse(data.userId, data.reportedId, data.message);
      });

      // Evento para silenciar notificaciones
      socket.on('mute notifications', (data: { userId: string; targetId: string; targetType: 'user' | 'group' }) => {
        this.muteNotifications(data.userId, data.targetId, data.targetType);
      });

  
    });
  }

  // Métodos privados para las nuevas funcionalidades

  // Buscar usuarios por query
  private searchUsers(query: string): void {
    // Implementar la lógica para buscar usuarios
    const foundUsers = Array.from(connectedUsersMap.keys()).filter((user) =>
      user.toLowerCase().includes(query.toLowerCase())
    );
    this.io.emit('search results', foundUsers);
  }

  // Establecer un estado personalizado
  private setCustomStatus(userId: string, status: string): void {
    this.io.to(connectedUsersMap.get(userId) || '').emit('custom status updated', { userId, status });
  }

  // Eliminar mensaje para el usuario actual
  private deleteMessageForMe(userId: string, messageId: string): void {
    this.io.to(connectedUsersMap.get(userId) || '').emit('message deleted for me', { messageId });
  }

  // Eliminar mensaje para todos
  private deleteMessageForEveryone(conversationId: string, messageId: string): void {
    this.io.to(conversationId).emit('message deleted for everyone', { messageId });
  }

  // Reportar abuso en mensajes o chats
  private reportAbuse(userId: string, reportedId: string, message: string): void {
    this.io.emit('abuse report', { userId, reportedId, message });
  }

  // Silenciar notificaciones
  private muteNotifications(userId: string, targetId: string, targetType: 'user' | 'group'): void {
    this.io.to(connectedUsersMap.get(userId) || '').emit('notifications muted', { targetId, targetType });
  }
}
