import { IFriendRequestDocument } from '@root/modules/sendfriend/interfaces/sendfriend.interfaces';
import { BaseCache } from './base.cache';

export class FriendRequestCache extends BaseCache {
  constructor() {
    super('FriendRequestCache');
  }
  async saveFriendRequest(friendRequestId: string, friendRequest: IFriendRequestDocument): Promise<void> {
    await this.client.set(friendRequestId, JSON.stringify(friendRequest));
  }

  async getFriendRequest(friendRequestId: string): Promise<IFriendRequestDocument | null> {
    const data = await this.client.get(friendRequestId);
    return data ? JSON.parse(data) : null;
  }

  async deleteFriendRequest(friendRequestId: string): Promise<void> {
    await this.client.del(friendRequestId);
  }
}

export const friendRequestCache = new FriendRequestCache();
