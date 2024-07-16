/* eslint-disable @typescript-eslint/no-explicit-any */
import { FriendRequestModel } from '@root/modules/sendfriend/models/sendfriend.schema';
import mongoose from 'mongoose';

class FriendRequestService {
  async createFriendRequest(senderId: string, receiverId: string) {
    const friendRequest = new FriendRequestModel({
      senderId,
      receiverId,
      status: 'pending'
    });
    await friendRequest.save();
    return friendRequest;
  }

  async updateFriendRequestStatus(requestId: string, status: string): Promise<{ updatedRequest: any, senderId: string, receiverId: string }> {
    const objectId = new mongoose.Types.ObjectId(requestId);
    const updatedRequest = await FriendRequestModel.findByIdAndUpdate(
      objectId,
      { $set: { status: status } },
      { new: true }
    ).exec();

    if (!updatedRequest) {
      throw new Error('Friend request not found');
    }

    return {
      updatedRequest,
      senderId: updatedRequest.senderId.toString(),
      receiverId: updatedRequest.receiverId.toString()
    };
  }
}

export const friendRequestService = new FriendRequestService();
