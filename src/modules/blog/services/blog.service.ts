/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';
import { Query, UpdateQuery } from 'mongoose';
import { BlogModel } from '../models/blog.schema';
import { IBlogDocument } from '../interfaces/blog.interface';

class BlogService {
  public async addBlogToDB(userId: string, createdBlog: IBlogDocument): Promise<void> {
    const blog: Promise<IBlogDocument> = BlogModel.create(createdBlog);
    const userUpdate: UpdateQuery<IUserDocument> = UserModel.updateOne(
      { _id: userId },
      { $push: { blogs: createdBlog._id }, $inc: { blogsCount: 1 } }
    );
    await Promise.all([blog, userUpdate]);
  }

  public async getUserBlogs(userId: string, skip = 0, limit = 0, sort: Record<string, 1 | -1>): Promise<IBlogDocument[]> {
    const blogs: IBlogDocument[] = await BlogModel.find({ userId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username profilePicture') 
      .exec();
    return blogs;
  }

  public async blogsCount(): Promise<number> {
    const count: number = await BlogModel.find({}).countDocuments();
    return count;
  }

  public async deleteBlog(blogId: string, userId: string): Promise<void> {
    const deleteBlog: Query<any, IBlogDocument> = BlogModel.deleteOne({ _id: blogId });
    const decrementBlogCount: UpdateQuery<IUserDocument> = UserModel.updateOne({ _id: userId }, { $inc: { blogsCount: -1 } });
    await Promise.all([deleteBlog, decrementBlogCount]);
  }

  public async editBlog(blogId: string, updatedBlog: IBlogDocument): Promise<void> {
    const updateBlog: UpdateQuery<IBlogDocument> = BlogModel.updateOne({ _id: blogId }, { $set: updatedBlog });
    await Promise.all([updateBlog]);
  }
}

export const blogService: BlogService = new BlogService();
