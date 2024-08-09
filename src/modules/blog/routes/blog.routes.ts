import express, { Router } from 'express';
import { authMiddleware } from '@globals/helpers/auth-middleware';
import { Get } from '../controllers/get-blog';
import { Create } from '../controllers/create-blog';

class BlogRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/blog/all/:page', authMiddleware.checkAuthentication, Get.prototype.getUserBlogs);
    this.router.get('/blog/images/:page', authMiddleware.checkAuthentication, Get.prototype.getUserBlogsWithImages);

    this.router.post('/blog', authMiddleware.checkAuthentication, Create.prototype.createBlog);
    this.router.post('/blog/image', authMiddleware.checkAuthentication, Create.prototype.createBlogWithImage);

    this.router.delete('/blog/:blogId', authMiddleware.checkAuthentication, Create.prototype.deleteBlog);

    return this.router;
  }
}

export const blogRoutes: BlogRoutes = new BlogRoutes();
