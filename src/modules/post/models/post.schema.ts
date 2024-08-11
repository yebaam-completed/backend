import mongoose, { model, Model, Schema } from 'mongoose';
import { IPostDocument } from '@post/interfaces/post.interface';

const postSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  username: { type: String },
  email: { type: String },
  avatarColor: { type: String },
  profilePicture: { type: String },
  post: { type: String, default: '' },
  bgColor: { type: String, default: '' },
  imgVersion: { type: String, default: '' },
  imgId: { type: String, default: '' },
  videoVersion: { type: String, default: '' },
  videoId: { type: String, default: '' },
  feelings: { type: String, default: '' },
  gifUrl: { type: String, default: '' },
  location: { type: String },
  hashtags: [{ type: String }],
  allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  visibilityGroup: { type: String },
  updatedAt: { type: Date, default: Date.now },
  mentionedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isDistributed: { type: Boolean, default: false },
  privacy: { type: String, enum: ['public', 'private', 'friends', 'custom'], default: 'public' },
  tags: [{ type: String }],
  interactionScore: { type: Number, default: 0 },
  isCached: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  reported: { type: Number, default: 0 },

  commentsCount: { type: Number, default: 0 },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    happy: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    angry: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

const PostModel: Model<IPostDocument> = model<IPostDocument>('Post', postSchema, 'Post');

export { PostModel };
