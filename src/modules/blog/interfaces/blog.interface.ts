import mongoose, { Document } from 'mongoose';

export interface IBlogDocument extends Document {
  imgId: string[];
  imgVersion: string[];
  _id?: string | mongoose.Types.ObjectId;
  userId: string;
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
