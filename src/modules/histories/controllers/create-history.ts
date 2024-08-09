import { joiValidation } from '@globals/decorators/joi-validation.decorators';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import { socketIOStoryObject } from '@socket/storySocket';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@globals/helpers/cloudinary-upload';
import { BadRequestError } from '@globals/helpers/error-handler';
import { storySchema, storyWithImageSchema } from '../validations/storyValidation';
import { IStory } from '../interfaces/story.interface';
import { storyService } from '../services/story.service';

export class Create {
  @joiValidation(storySchema)
  public async createStory(req: Request, res: Response): Promise<void> {
    const { content } = req.body;
    const userId = req.currentUser!.userId; 
    const storyObjectId: ObjectId = new ObjectId();

    const createdStory: IStory = {
      _id: storyObjectId.toHexString(),
      userId,
      content,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    } as IStory;

    await storyService.addStoryToDB(userId, createdStory);
    socketIOStoryObject.emit('addStory', createdStory);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Story created successfully', story: createdStory });
  }



 @joiValidation(storyWithImageSchema)
  public async createStoryWithImage(req: Request, res: Response): Promise<void> {
    const { content, image } = req.body;
    const userId = req.currentUser!.userId; 

    const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError(result.message);
    }

    const storyObjectId: ObjectId = new ObjectId();
    const createdStory: IStory = {
      _id: storyObjectId.toHexString(),
      userId,
      content,
      imgVersion: result.version.toString(),
      imgId: result.public_id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    } as IStory;

    await storyService.addStoryToDB(userId, createdStory);
    socketIOStoryObject.emit('addStory', createdStory);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Story created with image successfully', story: createdStory });
  }


  public async deleteStory(req: Request, res: Response): Promise<void> {
    const { storyId } = req.params;
    const userId = req.currentUser!.userId; 

    try {
      await storyService.deleteStory(storyId, userId);
      res.status(HTTP_STATUS.OK).json({ message: 'Story deleted successfully' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete story' });
    }
  }

}
