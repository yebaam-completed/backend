import express, { Router } from 'express';
import { authMiddleware } from '@globals/helpers/auth-middleware';
import { FriendRequestController } from '../controllers/send-friend';

class SendFriendRoutes {
  private router: Router;
  private friendRequestController: FriendRequestController;

  constructor() {
    this.router = express.Router();
    this.friendRequestController = new FriendRequestController();
    this.routes();
  }

  public routes(): Router {
    this.router.post('/send', authMiddleware.checkAuthentication, this.friendRequestController.sendFriendRequest);
    this.router.post('/accept/:requestId', authMiddleware.checkAuthentication, this.friendRequestController.acceptFriendRequest);
    this.router.post('/reject/:requestId', authMiddleware.checkAuthentication, this.friendRequestController.rejectFriendRequest);

    return this.router;
  }
}

export const sendFriendRoutes: SendFriendRoutes = new SendFriendRoutes();
