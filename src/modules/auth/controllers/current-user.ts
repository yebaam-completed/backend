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
      //console.log('token', token);
      user = existingUser;
      // console.log('first', user);
    }
    res.status(HTTP_STATUS.OK).json({ token, isUser, user });
  }

}
// export class CurrentUser {
//   public async read(req: Request, res: Response): Promise<void> {
//     let isUser = false;
//     let token = null;
//     let user: IUserDocument | null = null;

//     // Obtener el usuario desde Redis o base de datos.
//     const cachedUser: IUserDocument | null = await userCache.getUserFromCache(`${req.currentUser!.userId}`);
//     const existingUser: IUserDocument | null = cachedUser || (await userService.getUserById(`${req.currentUser!.userId}`));

//     if (existingUser) {
//       isUser = true;
//       token = req.session?.jwt;

//       // Deserializar campos específicos
//       existingUser.residendencia = JSON.parse(existingUser.residendencia as unknown as string);
//       existingUser.perfil = JSON.parse(existingUser.perfil as unknown as string);
//       existingUser.infoGeneral = JSON.parse(existingUser.infoGeneral as unknown as string);
//       existingUser.empleo = JSON.parse(existingUser.empleo as unknown as string);
//       existingUser.acontecimientos = JSON.parse(existingUser.acontecimientos as unknown as string);
//       existingUser.contact = JSON.parse(existingUser.contact as unknown as string);
//       existingUser.relacion = JSON.parse(existingUser.relacion as unknown as string);
//       existingUser.preferences = JSON.parse(existingUser.preferences as unknown as string);
//       existingUser.searchHistory = JSON.parse(existingUser.searchHistory as unknown as string);
//       existingUser.featuredFriends = JSON.parse(existingUser.featuredFriends as unknown as string);
//       // Deserializar `privacySettings`
//       if (existingUser.privacySettings) {
//         existingUser.privacySettings = JSON.parse(existingUser.privacySettings as unknown as string);
//       }
//       user = existingUser;
//     }

//     // Enviar datos deserializados al cliente
//     res.status(HTTP_STATUS.OK).json({ token, isUser, user });
//   }
// }
