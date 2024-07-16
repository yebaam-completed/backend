import { friendRequestService } from '@service/db/senfriend.service';
import { userService } from '@user/services/user.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class FriendRequestController {
  async sendFriendRequest(req: Request, res: Response): Promise<void> {
    const { receiverId } = req.body;
    const senderId = req.currentUser!.userId;
    const friendRequest = await friendRequestService.createFriendRequest(senderId, receiverId);
    res.status(HTTP_STATUS.CREATED).json(friendRequest);
  }

  async acceptFriendRequest(req: Request, res: Response): Promise<void> {
    const { requestId } = req.params;

    try {
        const { updatedRequest, senderId, receiverId } = await friendRequestService.updateFriendRequestStatus(requestId, 'accepted');

        // Actualiza los contadores en MongoDB
        await userService.incrementFollowersCount(receiverId);
        await userService.incrementFollowingCount(senderId);

        // Actualiza los contadores en Redis
        // redisClient.hIncrBy(`users:${receiverId}`, 'followersCount', 1);
        // redisClient.hIncrBy(`users:${senderId}`, 'followingCount', 1);

        // Responde a la solicitud
        res.status(HTTP_STATUS.OK).json(updatedRequest);
    } catch (error) {
        console.error('Error al aceptar solicitud de amistad:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send('Error al procesar la solicitud');
    }
}
  async rejectFriendRequest(req: Request, res: Response): Promise<void> {
    const { requestId } = req.params;
    const updatedRequest = await friendRequestService.updateFriendRequestStatus(requestId, 'rejected');
    res.status(HTTP_STATUS.OK).json(updatedRequest);
  }
}
