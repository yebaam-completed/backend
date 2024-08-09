import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';
import { Query, UpdateQuery } from 'mongoose';
import { StoryModel } from '../models/histories.schemes';
import { IQueryComplete, IQueryDeleted, IStory } from '../interfaces/story.interface';

class StoryService {
  public async addStoryToDB(userId: string, createdStory: IStory): Promise<void> {
    const story: Promise<IStory> = StoryModel.create(createdStory);
    const userUpdate: UpdateQuery<IUserDocument> = UserModel.updateOne(
      { _id: userId },
      { $push: { stories: createdStory._id }, $inc: { storiesCount: 1 } }
    );
    await Promise.all([story, userUpdate]);
  }
  
  public async getUserStories(userId: string, skip = 0, limit = 0, sort: Record<string, 1 | -1>): Promise<IStory[]> {
    const stories: IStory[] = await StoryModel.find({ userId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username profilePicture') 
      .exec();
    return stories;
  }

  public async storiesCount(): Promise<number> {
    const count: number = await StoryModel.find({}).countDocuments();
    return count;
  }

  public async deleteStory(storyId: string, userId: string): Promise<void> {
    const deleteStory: Query<IQueryComplete & IQueryDeleted, IStory> = StoryModel.deleteOne({ _id: storyId });
    const decrementStoryCount: UpdateQuery<IUserDocument> = UserModel.updateOne({ _id: userId }, { $inc: { storiesCount: -1 } });
    await Promise.all([deleteStory, decrementStoryCount]);
  }

  public async editStory(storyId: string, updatedStory: IStory): Promise<void> {
    const updateStory: UpdateQuery<IStory> = StoryModel.updateOne({ _id: storyId }, { $set: updatedStory });
    await Promise.all([updateStory]);
  }
}

export const storyService: StoryService = new StoryService();
