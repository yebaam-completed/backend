import express, { Router } from 'express';
import { Create } from '../controllers/create-history';
import { Get } from '../controllers/get-histories';
import { authMiddleware } from '@globals/helpers/auth-middleware';

class StoryRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/stories/all/:page', authMiddleware.checkAuthentication, Get.prototype.getUserStories);
    this.router.get('/stories/images/:page', authMiddleware.checkAuthentication, Get.prototype.getUserStoriesWithImages);

    this.router.post('/story', authMiddleware.checkAuthentication, Create.prototype.createStory);
    this.router.post('/story/image', authMiddleware.checkAuthentication, Create.prototype.createStoryWithImage);

    this.router.delete('/story/:storyId', authMiddleware.checkAuthentication, Create.prototype.deleteStory);

    return this.router;
  }
}

export const storyRoutes: StoryRoutes = new StoryRoutes();
