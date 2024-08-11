import express, { Router } from 'express';
import { authMiddleware } from '@globals/helpers/auth-middleware';
import { FriendRequestController } from '../controllers/create';

class FriendRequestRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    const friendRequestController = new FriendRequestController();

    this.router.post('/friend-request', authMiddleware.checkAuthentication, friendRequestController.sendFriendRequest);
    this.router.put('/friend-request/accept/:requestId', authMiddleware.checkAuthentication, friendRequestController.acceptFriendRequest);
    this.router.put('/friend-request/reject/:requestId', authMiddleware.checkAuthentication, friendRequestController.rejectFriendRequest);
    this.router.delete('/friend-request/cancel/:requestId', authMiddleware.checkAuthentication, friendRequestController.cancelFriendRequest);
    this.router.get('/friend-requests', authMiddleware.checkAuthentication, friendRequestController.getFriendRequests);
    this.router.get('/friend-request/:requestId/status', authMiddleware.checkAuthentication, friendRequestController.getFriendRequestStatus);
    this.router.delete('/friend/:friendId', authMiddleware.checkAuthentication, friendRequestController.removeFriend);


    // cambiar este, y pasarlo el comtrolador del user
    this.router.get('/user/profile/:userId', authMiddleware.checkAuthentication, friendRequestController.getUserProfile);
    this.router.get('/friends', authMiddleware.checkAuthentication, friendRequestController.getFriends);
    this.router.get('/user/non-friends', authMiddleware.checkAuthentication, friendRequestController.getNonFriends);


    return this.router;
  }
}

export const friendRequestRoutes: FriendRequestRoutes = new FriendRequestRoutes();
