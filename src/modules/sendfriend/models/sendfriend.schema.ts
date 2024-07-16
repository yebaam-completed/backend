import mongoose, { model, Model, Schema } from 'mongoose';
import { IFriendRequestDocument } from '../interfaces/sendfriend.interfaces';

const friendRequestSchema: Schema = new Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const FriendRequestModel: Model<IFriendRequestDocument> = model<IFriendRequestDocument>(
  'FriendRequest',
  friendRequestSchema,
  'FriendRequest'
);
export { FriendRequestModel };
