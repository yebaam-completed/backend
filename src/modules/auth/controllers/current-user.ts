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
    // Primero buscar en la base de datos
    const existingUser: IUserDocument = await userService.getUserById(`${req.currentUser!.userId}`);
    console.log('existingUser,existingUsermongo',req.currentUser!.userId);
    // Si no se encuentra en la base de datos, buscar en la caché
    const cachedUser: IUserDocument = existingUser ? existingUser : (await userCache.getUserFromCache(`${req.currentUser!.userId}`)) as IUserDocument;
    console.log('cachedUser redis:', req.currentUser!.userId);

    if (Object.keys(cachedUser).length) {
      isUser = true;
      token = req.session?.jwt;
      user = cachedUser;
    }
    res.status(HTTP_STATUS.OK).json({ token, isUser, user });
  }
}
