import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export interface IFriendRequestDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId | string;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFriendRequest {
  _id: mongoose.Types.ObjectId | string;
  senderId: IFriendRequestData;
  receiverId: IFriendRequestData;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFriendRequestData {
  username: string;
  avatarColor: string;
  profilePicture: string;
  _id?: mongoose.Types.ObjectId;
  userId?: string;
  userProfile?: mongoose.Document;
}

export interface IFriendRequestJobData {
  senderId: string | ObjectId;
  receiverId: string | ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  requestId?: string | ObjectId; // Opcional, para identificar la solicitud específica
}
