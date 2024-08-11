/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { friendRequestService } from '../services/friend.service';
import { UserModel } from '@user/models/user.schema';

export class FriendRequestController {
  public async sendFriendRequest(req: Request, res: Response): Promise<void> {
    try {
      const { receiverId } = req.body;
  
      if (!req.currentUser || !req.currentUser.userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }
  
      const senderId = req.currentUser.userId;
      await friendRequestService.sendFriendRequest(senderId, receiverId);
  
      res.status(HTTP_STATUS.OK).json({ message: 'Friend request sent successfully' });
    } catch (error) {
      if (error instanceof Error) {
        // Ahora TypeScript sabe que error es de tipo Error
        if (error.message === 'Ya has enviado una solicitud de amistad a este usuario') {
          res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });
        } else if (error.message === 'Ya son amigos') {
          res.status(HTTP_STATUS.CONFLICT).json({ message: error.message });
        } else {
          res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'No se pudo enviar la solicitud de amistad. Inténtalo de nuevo más tarde.' });
        }
      } else {
        // Manejo de errores que no son de tipo Error
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Ocurrió un error inesperado.' });
      }
    }
  }
  

  public async acceptFriendRequest(req: Request, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;
      await friendRequestService.acceptFriendRequest(requestId);
      res.status(HTTP_STATUS.OK).json({ message: 'Friend request accepted' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error accepting friend request' });
    }
  }

  public async rejectFriendRequest(req: Request, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;
      await friendRequestService.rejectFriendRequest(requestId);
      res.status(HTTP_STATUS.OK).json({ message: 'Friend request rejected' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error rejecting friend request' });
    }
  }

  public async cancelFriendRequest(req: Request, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;
      await friendRequestService.cancelFriendRequest(requestId);
      res.status(HTTP_STATUS.OK).json({ message: 'Friend request cancelled' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error cancelling friend request' });
    }
  }

  public async getFriendRequests(req: Request, res: Response): Promise<void> {
    try {
      if (!req.currentUser || !req.currentUser.userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }
      
      const userId = req.currentUser.userId;
      const friendRequests = await friendRequestService.getFriendRequests(userId);
      
      res.status(HTTP_STATUS.OK).json({ message: 'Friend requests retrieved successfully', friendRequests });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving friend requests' });
    }
  }

  public async getFriendRequestStatus(req: Request, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;
      const friendRequest = await friendRequestService.getFriendRequestStatus(requestId);
      
      if (!friendRequest) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Friend request not found' });
        return;
      }
      
      res.status(HTTP_STATUS.OK).json({ message: 'Friend request status retrieved successfully', friendRequest });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving friend request status' });
    }
  }

  public async removeFriend(req: Request, res: Response): Promise<void> {
    try {
      const { friendId } = req.params;

      if (!req.currentUser || !req.currentUser.userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }
      
      const userId = req.currentUser.userId;
      await friendRequestService.removeFriend(userId, friendId);
      
      res.status(HTTP_STATUS.OK).json({ message: 'Friend removed successfully' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error removing friend' });
    }
  }


  public async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params; // Obtener el userId de los parámetros de la ruta
      const user = await UserModel.findById(userId)
        .select('-password -email') // Excluir campos sensibles
        .select('username'); // Asegurarse de que el campo username esté incluido

      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      res.status(200).json(user); // Enviar la información del usuario al frontend
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
    }
  }

  public async getFriends(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.currentUser!.userId; // Asumiendo que tienes un middleware que establece `req.currentUser`
      const friends = await friendRequestService.getUserFriends(userId);
      res.status(200).json(friends);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la lista de amigos' });
    }
  }
  public async getNonFriends(req: Request, res: Response): Promise<void> {
    try {
      if (!req.currentUser || !req.currentUser.userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }
  
      const userId = req.currentUser.userId;
  
      const user = await UserModel.findById(userId).populate('friends');
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
  
      const friendIds = user.friends?.map((friend: any) => friend._id) || [];
  
      const nonFriends = await UserModel.find({
        _id: { $nin: [...friendIds, userId] }
      }).select('_id username profilePicture'); // Solo seleccionamos los campos esenciales
  
      res.status(200).json({ users: nonFriends });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios' });
    }
  }
  
}
