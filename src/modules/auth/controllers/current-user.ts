import { Request, Response } from 'express';
import { IUserDocument } from '@user/interfaces/user.interface';
import HTTP_STATUS from 'http-status-codes';
import { UserCache } from '@user/redis/user.cache';
import { userService } from '@user/services/user.service';

const userCache: UserCache = new UserCache();

export class CurrentUser {
  public async read(req: Request, res: Response): Promise<void> {
    try {
      let isUser = false;
      let token = null;
      let user = null;

      // Verificar si `userId` existe en la solicitud
      if (!req.currentUser?.userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return; // Asegúrate de terminar la ejecución de la función
      }

      const userId = req.currentUser.userId;

      // Obtener el usuario de la caché o de la base de datos
      const cachedUser: IUserDocument = await userCache.getUserFromCache(userId) as IUserDocument;
      const existingUser: IUserDocument = cachedUser || await userService.getUserById(userId);

      // if (existingUser) {
      //   isUser = true;
      //   token = req.session?.jwt || null;
      //   user = {
      //     _id: existingUser._id,
      //     username: existingUser.username,
      //     email: existingUser.email,
      //     avatarColor: existingUser.avatarColor,
      //     profilePicture: existingUser.profilePicture,

      //   };
      // }
      if (existingUser) {
        isUser = true;
        token = req.session?.jwt || null;
        user = {
          _id: existingUser._id,
          authId: existingUser.authId,
          username: existingUser.username,
          email: existingUser.email,
          password: existingUser.password,
          avatarColor: existingUser.avatarColor,
          uId: existingUser.uId,
          postsCount: existingUser.postsCount,
          work: existingUser.work,
          school: existingUser.school,
          quote: existingUser.quote,
          infoGeneral: existingUser.infoGeneral,
          empleo: existingUser.empleo,
          residendencia: existingUser.residendencia,
          contact: existingUser.contact,
          relacion: existingUser.relacion,
          perfil: existingUser.perfil,
          acontecimientos: existingUser.acontecimientos,
          location: existingUser.location,
          blocked: existingUser.blocked,
          blockedBy: existingUser.blockedBy,
          followersCount: existingUser.followersCount,
          followingCount: existingUser.followingCount,
          notifications: existingUser.notifications,
          social: existingUser.social,
          bgImageVersion: existingUser.bgImageVersion,
          bgImageId: existingUser.bgImageId,
          profilePicture: existingUser.profilePicture,
          privacy: existingUser.privacy,
          privacySettings: existingUser.privacySettings,
          lastActive: existingUser.lastActive,
          featuredFriends: existingUser.featuredFriends,
          savedPosts: existingUser.savedPosts,
          preferences: existingUser.preferences,
          searchHistory: existingUser.searchHistory,
          friendRequests: existingUser.friendRequests,
          friends: existingUser.friends,
          createdAt: existingUser.createdAt
        };
      }
      

      // Respuesta final
      res.status(HTTP_STATUS.OK).json({ token, isUser, user });
    } catch (error) {
      console.error('Error en currentUser:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching current user' });
    }
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
