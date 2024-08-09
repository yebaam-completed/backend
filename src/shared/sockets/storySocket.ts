/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server, Socket } from 'socket.io';

export let socketIOStoryObject: Server;

export interface IStory {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  expiresAt: Date;
}

export class SocketIOStoryHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOStoryObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      // Evento para crear una historia
      socket.on('postStory', (story: IStory) => {
        // Emite la nueva historia a todos los clientes conectados
        this.io.emit('newStory', story);
      });

      // Evento para obtener historias de un usuario
      socket.on('getUserStories', (userId: string) => {
        // Aquí deberías llamar a tu servicio para obtener las historias del usuario
        // Ejemplo: const stories = StoryService.getUserStories(userId);
        const stories: IStory[] = []; // Reemplaza con la llamada a tu servicio
        socket.emit('userStories', stories);
      });
    });
  }
}
