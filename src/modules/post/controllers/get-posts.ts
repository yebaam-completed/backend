import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IPostDocument } from '@post/interfaces/post.interface';
import { PostCache } from '@service/redis/post.cache';
import { postService } from '@service/db/post.service';

const postCache: PostCache = new PostCache();
const PAGE_SIZE = 10;

export class Get {
  public async posts(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE * parseInt(page);
    const newSkip: number = skip === 0 ? skip : skip + 1;
    let posts: IPostDocument[] = [];
    let totalPosts = 0;
    const cachedPosts: IPostDocument[] = await postCache.getPostsFromCache('post', newSkip, limit);
    if (cachedPosts.length) {
      posts = cachedPosts;
      totalPosts = await postCache.getTotalPostsInCache();
    } else {
      posts = await postService.getPosts({}, skip, limit, { createdAt: -1 });
      totalPosts = await postService.postsCount();
    }
    res.status(HTTP_STATUS.OK).json({ message: 'All posts', posts, totalPosts });
  }

  public async postsWithImages(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE * parseInt(page);
    const newSkip: number = skip === 0 ? skip : skip + 1;
    let posts: IPostDocument[] = [];
    const cachedPosts: IPostDocument[] = await postCache.getPostsWithImagesFromCache('post', newSkip, limit);
    posts = cachedPosts.length ? cachedPosts : await postService.getPosts({ imgId: '$ne', gifUrl: '$ne' }, skip, limit, { createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ message: 'All posts with images', posts });
  }

  public async postsWithVideos(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE * parseInt(page);
    const newSkip: number = skip === 0 ? skip : skip + 1;
    let posts: IPostDocument[] = [];
    const cachedPosts: IPostDocument[] = await postCache.getPostsWithVideosFromCache('post', newSkip, limit);
    posts = cachedPosts.length ? cachedPosts : await postService.getPosts({ videoId: '$ne' }, skip, limit, { createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ message: 'All posts with videos', posts });
  }

  public async postById(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const post = await postService.getPostById(postId);

      if (!post) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Post not found' });
        return;
      }

      res.status(HTTP_STATUS.OK).json({ message: 'Post found', post });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving post' });
    }
  }

  public async addLike(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const updatedPost = await postService.addLike(postId);

      if (!updatedPost) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Post not found' });
        return;
      }

      res.status(HTTP_STATUS.OK).json({ message: 'Like added', post: updatedPost });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error adding like to post' });
    }
  }


  public async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { comment } = req.body;
  
      // Verifica que req.currentUser no sea undefined o null
      if (!req.currentUser || !req.currentUser.userId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }
  
      const { userId, username, profilePicture } = req.currentUser;
  
      const updatedPost = await postService.addComment(postId, comment, userId, username, profilePicture);
  
      if (!updatedPost) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Post not found' });
        return;
      }
  
      res.status(HTTP_STATUS.OK).json({ message: 'Comment added', post: updatedPost });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error adding comment to post' });
    }
  }

  public async getPostsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const posts = await postService.getPostsByUser(userId);

      if (!posts || posts.length === 0) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No posts found for this user' });
        return;
      }

      res.status(HTTP_STATUS.OK).json({ message: 'Posts retrieved successfully', posts });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving posts for the user' });
    }
  }

  public async getUserPosts(req: Request, res: Response): Promise<void> {
    try {
      if (!req.currentUser || !req.currentUser.userId) {
        console.log('User not authenticated');
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'User not authenticated' });
        return;
      }
  
      const { userId } = req.currentUser;
      console.log(`Retrieving posts for user: ${userId}`);
  
      const posts = await postService.getUserPosts(userId);
      console.log(`Posts retrieved: ${posts.length}`);
  
      if (!posts || posts.length === 0) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No posts found for this user' });
        return;
      }
  
      res.status(HTTP_STATUS.OK).json({ message: 'User posts retrieved successfully', posts });
    } catch (error) {
      console.error('Error occurred while retrieving user posts:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving post' });
    }
  }

  public async searchPosts(req: Request, res: Response): Promise<void> {
    try {
      const { searchTerm } = req.query;

      if (!searchTerm) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Search term is required' });
        return;
      }

      const posts = await postService.searchPosts(searchTerm as string);

      if (!posts || posts.length === 0) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No posts found matching the search criteria' });
        return;
      }

      res.status(HTTP_STATUS.OK).json({ message: 'Search results retrieved successfully', posts });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving search results' });
    }
  }

  public async reportPost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const reportedPost = await postService.reportPost(postId);

      if (!reportedPost) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Post not found' });
        return;
      }

      res.status(HTTP_STATUS.OK).json({ message: 'Post reported successfully', post: reportedPost });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error reporting the post' });
    }
  }

  public async getPopularPosts(req: Request, res: Response): Promise<void> {
    try {
      const { page } = req.params;
      const pageNumber = parseInt(page, 10);

      if (isNaN(pageNumber) || pageNumber <= 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid page number' });
        return;
      }

      const posts = await postService.getPopularPosts(pageNumber, PAGE_SIZE);

      if (!posts || posts.length === 0) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No popular posts found' });
        return;
      }

      res.status(HTTP_STATUS.OK).json({ message: 'Popular posts retrieved successfully', posts });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving popular posts' });
    }
  }

  


  
  
}
