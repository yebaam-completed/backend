import { IPostDocument, IGetPostsQuery, IQueryComplete, IQueryDeleted } from '@post/interfaces/post.interface';
import { PostModel } from '@post/models/post.schema';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';
import { Query, UpdateQuery } from 'mongoose';

class PostService {
  public async addPostToDB(userId: string, createdPost: IPostDocument): Promise<void> {
    const post: Promise<IPostDocument> = PostModel.create(createdPost);
    const user: UpdateQuery<IUserDocument> = UserModel.updateOne({ _id: userId }, { $inc: { postsCount: 1 } });
    await Promise.all([post, user]);
  }

  public async getPosts(query: IGetPostsQuery, skip = 0, limit = 0, sort: Record<string, 1 | -1>): Promise<IPostDocument[]> {
    let postQuery = {};
    if (query?.imgId && query?.gifUrl) {
      postQuery = { $or: [{ imgId: { $ne: '' } }, { gifUrl: { $ne: '' } }] };
    } else if (query?.videoId) {
      postQuery = { $or: [{ videoId: { $ne: '' } }] };
    } else {
      postQuery = query;
    }
    const posts: IPostDocument[] = await PostModel.aggregate([{ $match: postQuery }, { $sort: sort }, { $skip: skip }, { $limit: limit }]);
    return posts;
  }

  public async postsCount(): Promise<number> {
    const count: number = await PostModel.find({}).countDocuments();
    return count;
  }

  public async deletePost(postId: string, userId: string): Promise<void> {
    const deletePost: Query<IQueryComplete & IQueryDeleted, IPostDocument> = PostModel.deleteOne({ _id: postId });
    // delete reactions here
    const decrementPostCount: UpdateQuery<IUserDocument> = UserModel.updateOne({ _id: userId }, { $inc: { postsCount: -1 } });
    await Promise.all([deletePost, decrementPostCount]);
  }

  public async editPost(postId: string, updatedPost: IPostDocument): Promise<void> {
    const updatePost: UpdateQuery<IPostDocument> = PostModel.updateOne({ _id: postId }, { $set: updatedPost });
    await Promise.all([updatePost]);
  }

  // nuevos metodos
  public async getPostById(postId: string): Promise<IPostDocument | null> {
    try {
      const post: IPostDocument | null = await PostModel.findById(postId);
      return post;
    } catch (error) {
      throw new Error('Error retrieving post');
    }
  }

  public async addLike(postId: string): Promise<IPostDocument | null> {
    try {
      // Encuentra la publicación por ID y aumenta el contador de "likes"
      const updatedPost = await PostModel.findByIdAndUpdate(postId, { $inc: { 'reactions.like': 1 } }, { new: true });

      return updatedPost;
    } catch (error) {
      throw new Error('Error adding like to post');
    }
  }

  public async addComment(
    postId: string,
    comment: string,
    userId: string,
    username: string,
    profilePicture: string
  ): Promise<IPostDocument | null> {
    try {
      // Crea el nuevo comentario
      const newComment = {
        comment,
        userId,
        username,
        profilePicture,
        createdAt: new Date()
      };

      // Encuentra la publicación por ID y agrega el comentario
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $push: { comments: newComment },
          $inc: { commentsCount: 1 }
        },
        { new: true }
      );

      return updatedPost;
    } catch (error) {
      throw new Error('Error adding comment to post');
    }
  }

  public async getPostsByUser(userId: string): Promise<IPostDocument[]> {
    try {
      const posts = await PostModel.find({ userId }).sort({ createdAt: -1 });
      return posts;
    } catch (error) {
      throw new Error('Error retrieving posts for the user');
    }
  }

  public async getUserPosts(userId: string): Promise<IPostDocument[]> {
    try {
      const posts = await PostModel.find({ userId }).sort({ createdAt: -1 });
      return posts;
    } catch (error) {
      throw new Error('Error retrieving user posts');
    }
  }

  public async searchPosts(searchTerm: string): Promise<IPostDocument[]> {
    try {
      const regex = new RegExp(searchTerm, 'i');
      const posts = await PostModel.find({
        $or: [{ post: regex }, { hashtags: regex }, { username: regex }]
      }).sort({ createdAt: -1 });

      return posts;
    } catch (error) {
      throw new Error('Error retrieving search results');
    }
  }

  public async reportPost(postId: string): Promise<IPostDocument | null> {
    try {
      const post = await PostModel.findByIdAndUpdate(postId, { $inc: { reported: 1 } }, { new: true });

      return post;
    } catch (error) {
      throw new Error('Error reporting the post');
    }
  }

  public async getPopularPosts(page: number, pageSize: number): Promise<IPostDocument[]> {
    try {
      const skip = (page - 1) * pageSize;
      const posts = await PostModel.aggregate([
        {
          $addFields: {
            popularityScore: {
              $add: [
                {
                  $sum: ['$reactions.like', '$reactions.love', '$reactions.happy', '$reactions.wow', '$reactions.sad', '$reactions.angry']
                },
                '$commentsCount'
              ]
            }
          }
        },
        { $sort: { popularityScore: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: pageSize }
      ]);

      return posts;
    } catch (error) {
      throw new Error('Error retrieving popular posts');
    }
  }

  public async sharePost(postId: string, recipientUserId: string): Promise<void> {
    const post = await PostModel.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const postObject = post.toObject();

    const sharedPost = new PostModel({
      ...postObject,
      userId: recipientUserId, 
      sharedBy: post.userId 
    });

    await sharedPost.save();

    // await notificationService.notify(recipientUserId, `Your friend shared a post with you!`);
  }
}

export const postService: PostService = new PostService();
