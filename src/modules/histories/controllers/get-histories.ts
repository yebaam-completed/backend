import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IStory } from '../interfaces/story.interface';
import { storyService } from '../services/story.service';

const PAGE_SIZE = 10;

export class Get {
  public async getUserStories(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const userId = req.currentUser!.userId; // Obtener el userId del usuario autenticado
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE;
    const sort: Record<string, 1 | -1> = { createdAt: -1 };
    let stories: IStory[] = [];
    let totalStories = 0;

    try {
      stories = await storyService.getUserStories(userId, skip, limit, sort);
      totalStories = await storyService.storiesCount();
      res.status(HTTP_STATUS.OK).json({ message: 'All stories', stories, totalStories });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get stories' });
    }
  }


  public async getUserStoriesWithImages(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const userId = req.currentUser!.userId; // Obtener el userId del usuario autenticado
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE;
    const sort: Record<string, 1 | -1> = { createdAt: -1 };
    let stories: IStory[] = [];

    try {
      stories = await storyService.getUserStories(userId, skip, limit, sort);
      stories = stories.filter(story => story.imgId && story.imgVersion);
      res.status(HTTP_STATUS.OK).json({ message: 'All stories with images', stories });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get stories with images' });
    }
  }


}
