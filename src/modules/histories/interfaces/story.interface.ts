import mongoose, { Document } from 'mongoose';

export interface IStory extends Document {
  _id?: string | mongoose.Types.ObjectId;
  userId: string;
  content: string;
  imgVersion?: string;
  imgId?: string;
  createdAt?: Date;
  expiresAt?: Date;
}

export interface IGetStoriesQuery {
  _id?: mongoose.Types.ObjectId | string;
  userId?: string;
  imgId?: string;
}

export interface ISaveStoryToCache {
  key: mongoose.Types.ObjectId | string;
  currentUserId: string;
  uId: string;
  createdStory: IStory;
}

export interface IStoryJobData {
  key?: string;
  value?: IStory;
  keyOne?: string;
  keyTwo?: string;
}

export interface IQueryComplete {
  ok?: number;
  n?: number;
}

export interface IQueryDeleted {
  deletedCount?: number;
}
