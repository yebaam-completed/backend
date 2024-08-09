import mongoose, { model, Model, Schema } from 'mongoose';
import { IBlogDocument } from '../interfaces/blog.interface';

const blogSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
  followers: { type: mongoose.Schema.Types.ObjectId, ref: 'Follower', required: false },
  reactions: { type: mongoose.Schema.Types.ObjectId, ref: 'Reaction', required: false },
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const BlogModel: Model<IBlogDocument> = model<IBlogDocument>('Blog', blogSchema, 'Blog');
export { BlogModel };
