import { IBlogDocument } from '@root/modules/blog/interfaces/blog.interface';
import { Server, Socket } from 'socket.io';

export let socketIOBlogObject: Server;

export class SocketIOBlogHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOBlogObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('createBlog', (blog: IBlogDocument) => {
        this.io.emit('newBlog', blog);
      });

      socket.on('updateBlog', (blog: IBlogDocument) => {
        this.io.emit('updatedBlog', blog);
      });

      socket.on('deleteBlog', (blogId: string) => {
        this.io.emit('deletedBlog', blogId);
      });
    });
  }
}
