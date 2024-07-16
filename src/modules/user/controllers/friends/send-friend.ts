/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';
import { UserCache } from '@user/redis/user.cache';



const userCache: UserCache = new UserCache();

export class FriendController {
  public async sendFriend(req: Request, res: Response): Promise<void> {
    // res.send('enviar solicitud');
    const { senderId, receiverId } = req.body;

    try {
      // Agregar solicitud de amistad a la caché
      await userCache.sendFriendRequest(senderId, receiverId);
  
      // Enviar respuesta exitosa
      res.status(HTTP_STATUS.OK).json({ message: 'Solicitud de amistad enviada correctamente' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al enviar solicitud de amistad', error });
    }
  }

  public async acceptFriend(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.body;

    try {
      // Aceptar solicitud en la caché
      await userCache.acceptFriendRequest(senderId, receiverId);
  
      res.status(HTTP_STATUS.OK).json({ message: 'Solicitud de amistad aceptada correctamente' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al aceptar solicitud de amistad', error });
    }
  }
  public async rejectFriend(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.body;

    try {
      // Rechazar solicitud en la caché
      await userCache.rejectFriendRequest(senderId, receiverId);
  
      res.status(HTTP_STATUS.OK).json({ message: 'Solicitud de amistad rechazada correctamente' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al rechazar solicitud de amistad', error });
    }  
  }
  public async cancelFriend(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.body;

    try {
      // Cancelar solicitud en la caché
      await userCache.cancelFriendRequest(senderId, receiverId);
  
      res.status(HTTP_STATUS.OK).json({ message: 'Solicitud de amistad cancelada correctamente' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al cancelar solicitud de amistad', error });
    }
  }

  public async getPendingFriend(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      // Obtener solicitudes pendientes desde la caché
      const pendingRequests = await userCache.getPendingFriendRequests(userId);
  
      res.status(HTTP_STATUS.OK).json({ pendingRequests });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener solicitudes de amistad pendientes', error });
    }
  }

  public async getFriends(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    try {
      // Obtener lista de amigos desde la caché
      const friends = await userCache.getFriendsList(userId);
  
      res.status(HTTP_STATUS.OK).json({ friends });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener lista de amigos', error });
    }
  }


  
  
}
