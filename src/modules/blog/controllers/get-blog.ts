import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IBlogDocument } from '../interfaces/blog.interface';
import { blogService } from '../services/blog.service';

const PAGE_SIZE = 10;

export class Get {
  public async getUserBlogs(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const userId = req.currentUser!.userId;
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE;
    const sort: Record<string, 1 | -1> = { createdAt: -1 };
    let blogs: IBlogDocument[] = [];
    let totalBlogs = 0;

    try {
      blogs = await blogService.getUserBlogs(userId, skip, limit, sort);
      totalBlogs = await blogService.blogsCount();
      res.status(HTTP_STATUS.OK).json({ message: 'All blogs', blogs, totalBlogs });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get blogs' });
    }
  }

  public async getUserBlogsWithImages(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const userId = req.currentUser!.userId;
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE;
    const sort: Record<string, 1 | -1> = { createdAt: -1 };
    let blogs: IBlogDocument[] = [];

    try {
      blogs = await blogService.getUserBlogs(userId, skip, limit, sort);
      blogs = blogs.filter(blog => blog.imgId && blog.imgVersion);
      res.status(HTTP_STATUS.OK).json({ message: 'All blogs with images', blogs });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get blogs with images' });
    }
  }
}
