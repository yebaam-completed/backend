import { UserModel } from '@user/models/user.schema';
import { Server } from 'socket.io';
import { IFriendRequestDocument } from '../interfaces/sendfriend.interfaces';
import { FriendRequestModel } from '../models/sendfriend.schema';
import { IUserDocument } from '@user/interfaces/user.interface';

class FriendRequestService {
  constructor(private io: Server) {}


  public async sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
    try {
      // Verificar si el usuario está intentando enviarse una solicitud de amistad a sí mismo
      if (senderId === receiverId) {
        throw new Error('No puedes enviarte una solicitud de amistad a ti mismo');
      }
  
      // Verificar si ya existe una solicitud de amistad pendiente entre estos usuarios
      const existingRequest = await FriendRequestModel.findOne({
        senderId,
        receiverId,
        status: 'pending'
      });
  
      if (existingRequest) {
        throw new Error('Ya has enviado una solicitud de amistad a este usuario');
      }
  
      // Verificar si ya son amigos
      const sender = await UserModel.findById(senderId);
      const receiver = await UserModel.findById(receiverId);
  
      if ((sender?.friends ?? []).includes(receiverId) || (receiver?.friends ?? []).includes(senderId)) {
        throw new Error('Ya son amigos');
      }
  
      // Si no hay solicitud pendiente ni son amigos, crear la solicitud
      const friendRequest = new FriendRequestModel({
        senderId,
        receiverId,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });
  
      await friendRequest.save();
  
      // Emitir la notificación al receptor
      this.io.to(receiverId).emit('friendRequestReceived', friendRequest);
  
      // Confirmar que la notificación fue enviada
      console.log(`Notificación enviada por Socket.io a usuario ${receiverId} para solicitud de amistad de ${senderId}`);
    } catch (error) {
      console.error('Error al enviar la solicitud de amistad:', error);
      throw new Error('No se pudo enviar la solicitud de amistad. Inténtalo de nuevo más tarde.');
    }
  }
  

  
  

  // Aceptar solicitud de amistad
  public async acceptFriendRequest(requestId: string): Promise<void> {
    const friendRequest = await FriendRequestModel.findByIdAndUpdate(
      requestId,
      { status: 'accepted' },
      { new: true }
    );

    if (!friendRequest) throw new Error('Friend request not found');

    // Añadir cada usuario como amigo del otro
    await Promise.all([
      UserModel.updateOne({ _id: friendRequest.senderId }, { $push: { friends: friendRequest.receiverId } }),
      UserModel.updateOne({ _id: friendRequest.receiverId }, { $push: { friends: friendRequest.senderId } })
    ]);

    // Notificar al emisor de la solicitud
    this.io.to(friendRequest.senderId.toString()).emit('friendRequestAccepted', friendRequest);
  }

  // Rechazar solicitud de amistad
  public async rejectFriendRequest(requestId: string): Promise<void> {
    const friendRequest = await FriendRequestModel.findByIdAndUpdate(
      requestId,
      { status: 'rejected' },
      { new: true }
    );

    if (!friendRequest) throw new Error('Friend request not found');

    // Notificar al emisor de la solicitud
    this.io.to(friendRequest.senderId.toString()).emit('friendRequestRejected', friendRequest);
  }

  // Cancelar solicitud de amistad
  public async cancelFriendRequest(requestId: string): Promise<void> {
    const friendRequest = await FriendRequestModel.findByIdAndDelete(requestId);

    if (!friendRequest) throw new Error('Friend request not found');

    // Notificar al receptor de la solicitud
    this.io.to(friendRequest.receiverId.toString()).emit('friendRequestCancelled', friendRequest);
  }

  // Obtener solicitudes de amistad
  public async getFriendRequests(userId: string): Promise<IFriendRequestDocument[]> {
    const receivedRequests = await FriendRequestModel.find({ receiverId: userId, status: 'pending' });
    const sentRequests = await FriendRequestModel.find({ senderId: userId, status: 'pending' });
    return [...receivedRequests, ...sentRequests];
  }

  // Obtener el estado de una solicitud de amistad
  public async getFriendRequestStatus(requestId: string): Promise<IFriendRequestDocument | null> {
    return await FriendRequestModel.findById(requestId);
  }

  // Eliminar a un amigo
  public async removeFriend(userId: string, friendId: string): Promise<void> {
    await Promise.all([
      UserModel.updateOne({ _id: userId }, { $pull: { friends: friendId } }),
      UserModel.updateOne({ _id: friendId }, { $pull: { friends: userId } })
    ]);

    // Notificar al amigo eliminado
    this.io.to(friendId).emit('friendRemoved', { userId, friendId });
  }

  // 

  public async getUserFriends(userId: string): Promise<IUserDocument[]> {
    const user = await UserModel.findById(userId).populate('friends', 'username profilePicture').exec();

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Asegurando que user.friends siempre sea un array
    const friends = user.friends as unknown as IUserDocument[]; 

    return friends;
  }
}

export const friendRequestService: FriendRequestService = new FriendRequestService(new Server());
