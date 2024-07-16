import { IBasicInfo, ISearchUser, IUserDocument, ISocialLinks, INotificationSettings, IDetalles, IPerfil } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';
import mongoose from 'mongoose';
import { indexOf } from 'lodash';
import { followerService } from '@service/db/follower.service';
import { AuthModel } from '@auth/models/auth.schema';

class UserService {
  public async addUserData(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }

  public async updatePassword(username: string, hashedPassword: string): Promise<void> {
    await AuthModel.updateOne({ username }, { $set: { password: hashedPassword } }).exec();
  }

  public async updateUserInfo(userId: string, info: IBasicInfo): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          work: info['work'],
          school: info['school'],
          quote: info['quote'],
          location: info['location'],
          infoProfile:info['infoProfile']
        }
      }
    ).exec();
  }

  public async updateSocialLinks(userId: string, links: ISocialLinks): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: { social: links }
      }
    ).exec();
  }

  public async updateNotificationSettings(userId: string, settings: INotificationSettings): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { $set: { notifications: settings } }).exec();
  }

  public async getUserById(userId: string): Promise<IUserDocument> {
    const users: IUserDocument[] = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId' } },
      { $unwind: '$authId' },
      { $project: this.aggregateProject() }
    ]);
    return users[0];
  }


  public async getUserByAuthId(authId: string): Promise<IUserDocument> {
    const users: IUserDocument[] = await UserModel.aggregate([
      { $match: { authId: new mongoose.Types.ObjectId(authId) } },
      { $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId' } },
      { $unwind: '$authId' },
      { $project: this.aggregateProject() }
    ]);
    return users[0];
  }

  public async getAllUsers(userId: string, skip: number, limit: number): Promise<IUserDocument[]> {
    const users: IUserDocument[] = await UserModel.aggregate([
      { $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
      { $skip: skip },
      { $limit: limit },
      { $sort: { createdAt: -1 } },
      { $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId' } },
      { $unwind: '$authId' },
      { $project: this.aggregateProject() }
    ]);
    return users;
  }

  public async getRandomUsers(userId: string): Promise<IUserDocument[]> {
    const randomUsers: IUserDocument[] = [];
    const users: IUserDocument[] = await UserModel.aggregate([
      { $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
      { $lookup: { from: 'Auth', localField: 'authId', foreignField: '_id', as: 'authId' } },
      { $unwind: '$authId' },
      { $sample: { size: 10 } },
      {
        $addFields: {
          username: '$authId.username',
          email: '$authId.email',
          avatarColor: '$authId.avatarColor',
          uId: '$authId.uId',
          createdAt: '$authId.createdAt'
        }
      },
      {
        $project: {
          authId: 0,
          __v: 0
        }
      }
    ]);
    const followers: string[] = await followerService.getFolloweesIds(`${userId}`);
    for (const user of users) {
      const followerIndex = indexOf(followers, user._id.toString());
      if (followerIndex < 0) {
        randomUsers.push(user);
      }
    }
    return randomUsers;
  }

  public async getTotalUsersInDB(): Promise<number> {
    const totalCount: number = await UserModel.find({}).countDocuments();
    return totalCount;
  }

  public async searchUsers(regex: RegExp): Promise<ISearchUser[]> {
    const users = await AuthModel.aggregate([
      { $match: { username: regex } },
      { $lookup: { from: 'User', localField: '_id', foreignField: 'authId', as: 'user' } },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          username: 1,
          email: 1,
          avatarColor: 1,
          profilePicture: 1
        }
      }
    ]);
    return users;
  }
  public async incrementFollowersCount(userId: string): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { $inc: { followersCount: 1 } }).exec();
  }

  public async incrementFollowingCount(userId: string): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { $inc: { followingCount: 1 } }).exec();
  }

  private aggregateProject() {
    return {
      _id: 1,
      username: '$authId.username',
      uId: '$authId.uId',
      email: '$authId.email',
      avatarColor: '$authId.avatarColor',
      createdAt: '$authId.createdAt',
      postsCount: 1,
      work: 1,
      school: 1,
      quote: 1,
      location: 1,
      blocked: 1,
      blockedBy: 1,
      followersCount: 1,
      followingCount: 1,
      notifications: 1,
      social: 1,
      bgImageVersion: 1,
      bgImageId: 1,
      profilePicture: 1,
      privacy: 1,
      privacySettings: 1,
      lastActive: 1,
      featuredFriends: 1,
      savedPosts: 1,
      preferences: 1,
      searchHistory: 1,
      infoGeneral: 1,
      empleo: 1,
      residendencia: 1,
      contact: 1,
      relacion: 1,
      perfil: 1,
      friendRequests: 1,
      friendsCount: 1,
      reels: 1,
      stories: 1,
      detalles: 1
    };
  }

  // nuevos metodos se deben pagar la habilitacion de estos metodos
 /**
   * Actualiza la información detallada del perfil de un usuario.
   * @param userId El ID del usuario a actualizar.
   * @param profileDetails Un objeto con los detalles de perfil a actualizar.
   * @returns La respuesta de la operación de actualización.
   */
 public async updateProfileDetails(userId: string, profileDetails: IPerfil): Promise<void> {
  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        'perfil.presentacion': profileDetails.presentacion || '',
        'perfil.educacion': profileDetails.educacion || [],
        'perfil.empleoFormacion': profileDetails.empleoFormacion || [],
        'perfil.empleo': profileDetails.empleo || [],
        'perfil.infoUsuario': profileDetails.infoUsuario || { intereses: [], pasatiempos: [] },
        'perfil.informacionGeneral': profileDetails.informacionGeneral || {},
        'perfil.residencias': profileDetails.residencias || [],
        'perfil.contactoBasico': profileDetails.contactoBasico || {},
        'perfil.relaciones': profileDetails.relaciones || [],
        'perfil.acontecimientosImportantes': profileDetails.acontecimientosImportantes || [],
      }
    }
  ).exec();
}



  public async updateFriendRequestStatus(userId: string, senderId: string, status: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId, 'friendRequests.sender': new mongoose.Types.ObjectId(senderId) },
      { $set: { 'friendRequests.$.status': status } }
    ).exec();
  }

  public async addFriendRequest(userId: string, senderId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $push: { friendRequests: { sender: new mongoose.Types.ObjectId(senderId), status: 'pending', date: new Date() } } }
    ).exec();
  }
  public async updateUserDetails(userId: string, details: IDetalles): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { $set: { detalles: details } }).exec();
  }

  public async sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: receiverId },
      { $push: { friendRequests: { sender: new mongoose.Types.ObjectId(senderId), status: 'pending', date: new Date() } } }
    ).exec();
  }

  public async acceptFriendRequest(receiverId: string, senderId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: receiverId, 'friendRequests.sender': new mongoose.Types.ObjectId(senderId) },
      { $set: { 'friendRequests.$.status': 'accepted' } }
    ).exec();

    // Añadir al remitente y al receptor a sus respectivas listas de amigos
    await UserModel.updateOne({ _id: receiverId }, { $addToSet: { friends: senderId } }).exec();
    await UserModel.updateOne({ _id: senderId }, { $addToSet: { friends: receiverId } }).exec();
  }

  public async rejectFriendRequest(receiverId: string, senderId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: receiverId, 'friendRequests.sender': new mongoose.Types.ObjectId(senderId) },
      { $set: { 'friendRequests.$.status': 'rejected' } }
    ).exec();
  }

  public async cancelFriendRequest(senderId: string, receiverId: string): Promise<void> {
    await UserModel.updateOne({ _id: receiverId }, { $pull: { friendRequests: { sender: new mongoose.Types.ObjectId(senderId) } } }).exec();
  }

  public async getPendingFriendRequests(userId: string): Promise<{ sender: string; date: Date }[]> {
    // Obtén el usuario por ID, seleccionando solo el campo `friendRequests`
    const user: IUserDocument | null = await UserModel.findById(userId, 'friendRequests').exec();

    // Si `user` es nulo o `friendRequests` es `undefined`, devuelve un arreglo vacío
    if (!user || !user.friendRequests) {
      return [];
    }

    // Filtra las solicitudes pendientes y devuelve un arreglo con solo los campos `sender` y `date`
    return user.friendRequests.filter((req) => req.status === 'pending').map((req) => ({ sender: req.sender.toString(), date: req.date }));
  }

  public async getFriendsList(userId: string): Promise<string[]> {
    const user = await UserModel.findById(userId, 'friends').exec();
    return user?.friends || [];
  }
}

export const userService: UserService = new UserService();
