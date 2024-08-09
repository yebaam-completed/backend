import { joiValidation } from '@globals/decorators/joi-validation.decorators';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@globals/helpers/cloudinary-upload';
import { BadRequestError } from '@globals/helpers/error-handler';
import { IBlogDocument } from '../interfaces/blog.interface';
import { blogService } from '../services/blog.service';
import { blogSchema, blogWithImageSchema } from '../validators/blog.validator';
import { socketIOBlogObject } from '@socket/blog';

export class Create {
  @joiValidation(blogSchema)
  public async createBlog(req: Request, res: Response): Promise<void> {
    const { title, content, tags } = req.body;
    const userId = req.currentUser!.userId;
    const blogObjectId: ObjectId = new ObjectId();

    const createdBlog: IBlogDocument = {
      _id: blogObjectId.toHexString(),
      userId,
      title,
      content,
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    } as IBlogDocument;

    await blogService.addBlogToDB(userId, createdBlog);
    socketIOBlogObject.emit('newBlog', createdBlog);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Blog created successfully', blog: createdBlog });
  }

  @joiValidation(blogWithImageSchema)
  public async createBlogWithImage(req: Request, res: Response): Promise<void> {
    const { title, content, tags, image } = req.body;
    const userId = req.currentUser!.userId;

    const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError(result.message);
    }

    const blogObjectId: ObjectId = new ObjectId();
    const createdBlog: IBlogDocument = {
      _id: blogObjectId.toHexString(),
      userId,
      title,
      content,
      imgVersion: result.version.toString(),
      imgId: result.public_id,
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    } as unknown as IBlogDocument;

    await blogService.addBlogToDB(userId, createdBlog);
    socketIOBlogObject.emit('newBlog', createdBlog);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Blog created with image successfully', blog: createdBlog });
  }

  public async deleteBlog(req: Request, res: Response): Promise<void> {
    const { blogId } = req.params;
    const userId = req.currentUser!.userId;

    try {
      await blogService.deleteBlog(blogId, userId);
      res.status(HTTP_STATUS.OK).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete blog' });
    }
  }
}
