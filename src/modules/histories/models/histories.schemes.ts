import mongoose, { model, Model, Schema } from 'mongoose';
import { IStory } from '../interfaces/story.interface';

const storySchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  content: { type: String, required: true },
  imgVersion: { type: String, default: '' },
  imgId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 }, // 24 horas
});

const StoryModel: Model<IStory> = model<IStory>('Story', storySchema, 'Story');

export { StoryModel, IStory };
