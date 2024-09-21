import { Request, Response } from 'express';
import { IUserDocument } from '@user/interfaces/user.interface';
import HTTP_STATUS from 'http-status-codes';
import { UserCache } from '@user/redis/user.cache';
import { userService } from '@user/services/user.service';

const userCache: UserCache = new UserCache();

export class CurrentUser {
  public async read(req: Request, res: Response): Promise<void> {
    let isUser = false;
    let token = null;
    let user = null;
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser!.userId}`)) as IUserDocument;
    const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(`${req.currentUser!.userId}`);
    if (Object.keys(existingUser).length) {
      isUser = true;
      token = req.session?.jwt;
      console.log('token', token);
      user = existingUser;
      console.log('CurrentUser', user);
    }
    res.status(HTTP_STATUS.OK).json({ token, isUser, user });
  }

  public async token(req: Request, res: Response): Promise<void> {
    let isUser = false;
    let token = null;

    let user = null;
    const cachedUser: IUserDocument = (await userCache.getUserFromCache(`${req.currentUser!.username}`)) as IUserDocument;
    const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(`${req.currentUser!.username}`);
    if (Object.keys(existingUser).length) {
      isUser = true;
      token = req.session?.jwt;
      console.log('user', user);
      user = existingUser.username;
      // console.log('first', user);
    }
    res.status(HTTP_STATUS.OK).json({ token, isUser, user });
  }


}
