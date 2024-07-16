import { BaseCache } from '@service/redis/base.cache';
import { INotificationSettings, ISocialLinks, IUserDocument } from '@user/interfaces/user.interface';
import Logger from 'bunyan';
import { indexOf, findIndex } from 'lodash';
import { config } from '@root/config';
import { ServerError } from '@globals/helpers/error-handler';
import { Helpers } from '@globals/helpers/helpers';
import { RedisCommandRawReply } from '@redis/client/dist/lib/commands';

const log: Logger = config.createLogger('userCache');
type UserItem = string | ISocialLinks | INotificationSettings;
type UserCacheMultiType = string | number | Buffer | RedisCommandRawReply[] | IUserDocument | IUserDocument[];

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }
  // public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
  //   const createdAt = new Date();
  //   const {
  //     _id,
  //     authId,
  //     uId,
  //     username,
  //     email,
  //     password,
  //     avatarColor,
  //     postsCount,
  //     work,
  //     school,
  //     quote,
  //     infoGeneral,
  //     empleo,
  //     residendencia,
  //     contact,
  //     relacion,
  //     perfil,
  //     acontecimientos,
  //     location,
  //     blocked,
  //     blockedBy,
  //     followersCount,
  //     followingCount,
  //     notifications,
  //     social,
  //     bgImageVersion,
  //     bgImageId,
  //     profilePicture,
  //     privacy,
  //     privacySettings,
  //     lastActive,
  //     featuredFriends,
  //     savedPosts,
  //     preferences,
  //     searchHistory,
  //     createdAt: createdUserCreatedAt
  //   } = createdUser;
  
  //   const dataToSave = {
  //     _id: `${_id}`,
  //     authId: `${authId}`,
  //     uId: `${uId}`,
  //     username: `${username}`,
  //     email: `${email}`,
  //     password: `${password}`,
  //     avatarColor: `${avatarColor}`,
  //     createdAt: createdUserCreatedAt ? `${createdUserCreatedAt}` : `${createdAt}`,
  //     postsCount: `${postsCount}`,
  //     work: `${work}`,
  //     school: `${school}`,
  //     quote: `${quote}`,
  //     infoGeneral: JSON.stringify(infoGeneral),
  //     empleo: JSON.stringify(empleo),
  //     residendencia: JSON.stringify(residendencia),
  //     contact: JSON.stringify(contact),
  //     relacion: JSON.stringify(relacion),
  //     perfil: JSON.stringify(perfil),
  //     acontecimientos: JSON.stringify(acontecimientos),
  //     location: `${location}`,
  //     blocked: JSON.stringify(blocked),
  //     blockedBy: JSON.stringify(blockedBy),
  //     followersCount: `${followersCount}`,
  //     followingCount: `${followingCount}`,
  //     notifications: JSON.stringify(notifications),
  //     social: JSON.stringify(social),
  //     bgImageVersion: `${bgImageVersion}`,
  //     bgImageId: `${bgImageId}`,
  //     profilePicture: `${profilePicture}`,
  //     privacy: `${privacy}`,
  //     privacySettings: JSON.stringify(privacySettings),
  //     lastActive: lastActive ? `${lastActive}` : '',
  //     featuredFriends: JSON.stringify(featuredFriends),
  //     savedPosts: JSON.stringify(savedPosts),
  //     preferences: JSON.stringify(preferences),
  //     searchHistory: JSON.stringify(searchHistory)
  //   };
  
  //   try {
  //     if (!this.client.isOpen) {
  //       await this.client.connect();
  //     }
  
  //     await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` });
  //     for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
  //       await this.client.HSET(`users:${key}`, `${itemKey}`, `${itemValue}`);
  //     }
  //   } catch (error) {
  //     log.error(error);
  //     throw new ServerError('Server error. Try again.');
  //   }
  // }

  public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      authId,
      uId,
      username,
      email,
      password,
      avatarColor,
      postsCount,
      work,
      school,
      quote,
      infoGeneral,
      empleo,
      residendencia,
      contact,
      relacion,
      perfil,
      acontecimientos,
      location,
      blocked,
      blockedBy,
      followersCount,
      followingCount,
      notifications,
      social,
      bgImageVersion,
      bgImageId,
      profilePicture,
      privacy,
      privacySettings,
      lastActive,
      featuredFriends,
      savedPosts,
      preferences,
      searchHistory,
      createdAt: createdUserCreatedAt
    } = createdUser;
  
    const dataToSave = {
      _id: `${_id}`,
      authId: `${authId}`,
      uId: `${uId}`,
      username: `${username}`,
      email: `${email}`,
      password: `${password}`,
      avatarColor: `${avatarColor}`,
      createdAt: createdUserCreatedAt ? `${createdUserCreatedAt}` : `${createdAt}`,
      postsCount: `${postsCount}`,
      work: `${work}`,
      school: `${school}`,
      quote: `${quote}`,
      infoGeneral: JSON.stringify(infoGeneral),
      empleo: JSON.stringify(empleo),
      residendencia: JSON.stringify(residendencia),
      contact: JSON.stringify(contact),
      relacion: JSON.stringify(relacion),
      perfil: JSON.stringify(perfil),
      acontecimientos: JSON.stringify(acontecimientos),
      location: `${location}`,
      blocked: JSON.stringify(blocked),
      blockedBy: JSON.stringify(blockedBy),
      followersCount: `${followersCount}`,
      followingCount: `${followingCount}`,
      notifications: JSON.stringify(notifications),
      social: JSON.stringify(social),
      bgImageVersion: `${bgImageVersion}`,
      bgImageId: `${bgImageId}`,
      profilePicture: `${profilePicture}`,
      privacy: `${privacy}`,
      privacySettings: JSON.stringify(privacySettings),
      lastActive: lastActive ? `${lastActive}` : '',
      featuredFriends: JSON.stringify(featuredFriends),
      savedPosts: JSON.stringify(savedPosts),
      preferences: JSON.stringify(preferences),
      searchHistory: JSON.stringify(searchHistory)
    };
  
    console.log('Guardando en Redis:', dataToSave);
  
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
  
      await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` });
      for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
        await this.client.HSET(`users:${key}`, `${itemKey}`, `${itemValue}`);
      }
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
  
  

  public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const response: IUserDocument = (await this.client.HGETALL(`users:${userId}`)) as unknown as IUserDocument;
      response.createdAt = new Date(Helpers.parseJson(`${response.createdAt}`));
      response.postsCount = Helpers.parseJson(`${response.postsCount}`);
      response.blocked = Helpers.parseJson(`${response.blocked}`);
      response.blockedBy = Helpers.parseJson(`${response.blockedBy}`);
      response.notifications = Helpers.parseJson(`${response.notifications}`);
      response.social = Helpers.parseJson(`${response.social}`);
      response.followersCount = Helpers.parseJson(`${response.followersCount}`);
      response.followingCount = Helpers.parseJson(`${response.followingCount}`);
      response.bgImageId = Helpers.parseJson(`${response.bgImageId}`);
      response.bgImageVersion = Helpers.parseJson(`${response.bgImageVersion}`);
      response.profilePicture = Helpers.parseJson(`${response.profilePicture}`);
      response.work = Helpers.parseJson(`${response.work}`);
      response.school = Helpers.parseJson(`${response.school}`);
      response.location = Helpers.parseJson(`${response.location}`);
      response.quote = Helpers.parseJson(`${response.quote}`);

      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getUsersFromCache(start: number, end: number, excludedUserKey: string): Promise<IUserDocument[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: string[] = await this.client.ZRANGE('user', start, end);
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      for (const key of response) {
        if (key !== excludedUserKey) {
          multi.HGETALL(`users:${key}`);
        }
      }
      const replies: UserCacheMultiType = (await multi.exec()) as UserCacheMultiType;
      const userReplies: IUserDocument[] = [];
      for (const reply of replies as IUserDocument[]) {
        reply.createdAt = new Date(Helpers.parseJson(`${reply.createdAt}`));
        reply.postsCount = Helpers.parseJson(`${reply.postsCount}`);
        reply.blocked = Helpers.parseJson(`${reply.blocked}`);
        reply.blockedBy = Helpers.parseJson(`${reply.blockedBy}`);
        reply.notifications = Helpers.parseJson(`${reply.notifications}`);
        reply.social = Helpers.parseJson(`${reply.social}`);
        reply.followersCount = Helpers.parseJson(`${reply.followersCount}`);
        reply.followingCount = Helpers.parseJson(`${reply.followingCount}`);
        reply.bgImageId = Helpers.parseJson(`${reply.bgImageId}`);
        reply.bgImageVersion = Helpers.parseJson(`${reply.bgImageVersion}`);
        reply.profilePicture = Helpers.parseJson(`${reply.profilePicture}`);
        reply.work = Helpers.parseJson(`${reply.work}`);
        reply.school = Helpers.parseJson(`${reply.school}`);
        reply.location = Helpers.parseJson(`${reply.location}`);
        reply.quote = Helpers.parseJson(`${reply.quote}`);

        userReplies.push(reply);
      }
      return userReplies;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getRandomUsersFromCache(userId: string, excludedUsername: string): Promise<IUserDocument[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      // console.log(`Fetching random users from cache, excluding userId: ${userId} and username: ${excludedUsername}`);

      const replies: IUserDocument[] = [];
      const followers: string[] = await this.client.LRANGE(`followers:${userId}`, 0, -1);
      const users: string[] = await this.client.ZRANGE('user', 0, -1);

      // console.log(`Total users from cache: ${users.length}`);
      // console.log(`Followers of the current user: ${followers.length}`);

      const randomUsers: string[] = Helpers.shuffle(users).slice(0, 10);

      // console.log(`Randomly selected user keys: ${randomUsers}`);

      for (const key of randomUsers) {
        const followerIndex = indexOf(followers, key);
        if (followerIndex < 0) {
          const userHash: IUserDocument = (await this.client.HGETALL(`users:${key}`)) as unknown as IUserDocument;
          replies.push(userHash);
        }
      }
      const excludedUsernameIndex: number = findIndex(replies, ['username', excludedUsername]);
      if (excludedUsernameIndex !== -1) {
        // console.log(`Excluding user with username: ${excludedUsername}`);
        replies.splice(excludedUsernameIndex, 1);
      }
      for (const reply of replies) {
        reply.createdAt = new Date(Helpers.parseJson(`${reply.createdAt}`));
        reply.postsCount = Helpers.parseJson(`${reply.postsCount}`);
        reply.blocked = Helpers.parseJson(`${reply.blocked}`);
        reply.blockedBy = Helpers.parseJson(`${reply.blockedBy}`);
        reply.notifications = Helpers.parseJson(`${reply.notifications}`);
        reply.social = Helpers.parseJson(`${reply.social}`);
        reply.followersCount = Helpers.parseJson(`${reply.followersCount}`);
        reply.followingCount = Helpers.parseJson(`${reply.followingCount}`);
        reply.bgImageId = Helpers.parseJson(`${reply.bgImageId}`);
        reply.bgImageVersion = Helpers.parseJson(`${reply.bgImageVersion}`);
        reply.profilePicture = Helpers.parseJson(`${reply.profilePicture}`);
        reply.work = Helpers.parseJson(`${reply.work}`);
        reply.school = Helpers.parseJson(`${reply.school}`);
        reply.location = Helpers.parseJson(`${reply.location}`);
        reply.quote = Helpers.parseJson(`${reply.quote}`);
      }
      console.log(`Final list of suggested users: ${replies.length}`);
      return replies;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async updateSingleUserItemInCache(userId: string, prop: string, value: UserItem): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.HSET(`users:${userId}`, `${prop}`, JSON.stringify(value));
      const response: IUserDocument = (await this.getUserFromCache(userId)) as IUserDocument;
      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async updateSingleUserItemDetail(userId: string, prop: string, value: UserItem): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.HSET(`users:${userId}`, `${prop}`, JSON.stringify(value));
      const response: IUserDocument = (await this.getUserFromCache(userId)) as IUserDocument;
      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }


  public async getTotalUsersInCache(): Promise<number> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const count: number = await this.client.ZCARD('user');
      return count;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }

  // nuevos metodos
  public async sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const requestKey = `friendRequest:${senderId}:${receiverId}`;
      await this.client.HSET(requestKey, 'status', 'pending');
    } catch (error) {
      log.error(error);
      throw new ServerError('Error sending friend request.');
    }
  }

  public async acceptFriendRequest(senderId: string, receiverId: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      // Actualiza el estado de la solicitud
      const requestKey = `friendRequest:${senderId}:${receiverId}`;
      await this.client.HSET(requestKey, 'status', 'accepted');
      
      // Añadir a la lista de amigos del remitente
      await this.client.SADD(`friends:${senderId}`, receiverId);
      // Añadir a la lista de amigos del receptor
      await this.client.SADD(`friends:${receiverId}`, senderId);
    } catch (error) {
      log.error(error);
      throw new ServerError('Error accepting friend request.');
    }
  }

  public async rejectFriendRequest(senderId: string, receiverId: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const requestKey = `friendRequest:${senderId}:${receiverId}`;
      await this.client.HSET(requestKey, 'status', 'rejected');
    } catch (error) {
      log.error(error);
      throw new ServerError('Error rejecting friend request.');
    }
  }

  public async cancelFriendRequest(senderId: string, receiverId: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const requestKey = `friendRequest:${senderId}:${receiverId}`;
      await this.client.DEL(requestKey);
    } catch (error) {
      log.error(error);
      throw new ServerError('Error cancelling friend request.');
    }
  }

  public async getFriendRequestStatus(senderId: string, receiverId: string): Promise<string | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const requestKey = `friendRequest:${senderId}:${receiverId}`;
      const status = await this.client.HGET(requestKey, 'status');
      return status ? status : null;
    } catch (error) {
      log.error(error);
      throw new ServerError('Error fetching friend request status.');
    }
  }

  // metodos extranas
// Permite que un usuario elimine a alguien de su lista de amigos.
  public async removeFriend(userId: string, friendId: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.SREM(`friends:${userId}`, friendId);
      await this.client.SREM(`friends:${friendId}`, userId);
    } catch (error) {
      log.error(error);
      throw new ServerError('Error removing friend.');
    }
  }

  // Recupera la lista completa de amigos de un usuario.
  public async getFriendsList(userId: string): Promise<string[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const friends: string[] = await this.client.SMEMBERS(`friends:${userId}`);
      return friends;
    } catch (error) {
      log.error(error);
      throw new ServerError('Error fetching friends list.');
    }
  }
// Permite obtener una lista de solicitudes de amistad pendientes, enviadas al usuario.
  public async getPendingFriendRequests(receiverId: string): Promise<string[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const keys = await this.client.KEYS(`friendRequest:*:${receiverId}`);
      const pendingRequests: string[] = [];
      for (const key of keys) {
        const status = await this.client.HGET(key, 'status');
        if (status === 'pending') {
          const senderId = key.split(':')[1];
          pendingRequests.push(senderId);
        }
      }
      return pendingRequests;
    } catch (error) {
      log.error(error);
      throw new ServerError('Error fetching pending friend requests.');
    }
  }
// Sugiere posibles amigos basados en amigos en común.
  public async suggestFriends(userId: string): Promise<string[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const userFriends: string[] = await this.client.SMEMBERS(`friends:${userId}`);
      const suggestedFriends: Set<string> = new Set();
      for (const friend of userFriends) {
        const friendsOfFriend: string[] = await this.client.SMEMBERS(`friends:${friend}`);
        friendsOfFriend.forEach((f) => {
          if (f !== userId && !userFriends.includes(f)) {
            suggestedFriends.add(f);
          }
        });
      }
      return Array.from(suggestedFriends);
    } catch (error) {
      log.error(error);
      throw new ServerError('Error suggesting friends.');
    }
  }

  // Permite a un usuario bloquear a otro, impidiendo futuras solicitudes de amistad.
  public async blockUser(userId: string, blockedId: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.SADD(`blocked:${userId}`, blockedId);
    } catch (error) {
      log.error(error);
      throw new ServerError('Error blocking user.');
    }
  }

  // Permite que un usuario elimine a otro de su lista de bloqueados.
  public async unblockUser(userId: string, blockedId: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      await this.client.SREM(`blocked:${userId}`, blockedId);
    } catch (error) {
      log.error(error);
      throw new ServerError('Error unblocking user.');
    }
  }
  
// Método para Obtener el Perfil con Verificación de Privacidad

  public async getUserProfileWithPrivacy(requesterId: string, targetId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
  
      // Recupera el perfil y las listas relacionadas
      const profile: IUserDocument = (await this.client.HGETALL(`users:${targetId}`)) as unknown as IUserDocument;
      const friendsList: string[] = await this.client.SMEMBERS(`friends:${targetId}`);
      const privacySetting = profile.privacy || 'public';
  
      // Verificar si el solicitante es un amigo del objetivo
      const isFriend = friendsList.includes(requesterId);
  
      // Evaluar la configuración de privacidad
      if (privacySetting === 'friends' && !isFriend) {
        // Ocultar toda la información si no es un amigo
        return null;
      }
  
      // Analizar propiedades complejas
      profile.blocked = JSON.parse(profile.blocked as unknown as string);
      profile.blockedBy = JSON.parse(profile.blockedBy as unknown as string);
      profile.notifications = JSON.parse(profile.notifications as unknown as string);
      profile.social = JSON.parse(profile.social as unknown as string);
      profile.featuredFriends = JSON.parse(profile.featuredFriends as unknown as string);
      profile.savedPosts = JSON.parse(profile.savedPosts as unknown as string);
      profile.preferences = JSON.parse(profile.preferences as unknown as string);
      profile.searchHistory = JSON.parse(profile.searchHistory as unknown as string);
      profile.infoGeneral = JSON.parse(profile.infoGeneral as unknown as string);
      profile.perfil = JSON.parse(profile.perfil as unknown as string);
  
      // Convertir fechas desde cadenas
      profile.lastActive = profile.lastActive ? new Date(profile.lastActive) : undefined;
      profile.createdAt = profile.createdAt ? new Date(profile.createdAt) : undefined;
  
      return profile;
    } catch (error) {
      log.error(error);
      throw new ServerError('Error retrieving user profile with privacy.');
    }
  }
  
  
  
  
  
  
  
  
  
  
}
