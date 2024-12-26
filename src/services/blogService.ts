import { AppError } from '../types';
import BlogPost, { IBlogPost } from '../models/BlogPost';
import { Types } from 'mongoose';

class BlogService {
  async getAllPosts(page = 1, limit = 10, status = 'published') {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      BlogPost.find({ status })
        .populate('author', 'username profile.avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments({ status })
    ]);

    return {
      posts,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    };
  }

  async getPostById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid post ID', 400);
    }

    const post = await BlogPost.findById(id)
      .populate('author', 'username profile')
      .lean();
      
    if (!post) {
      throw new AppError('Blog post not found', 404);
    }
    return post;
  }

  async createPost(postData: Partial<IBlogPost>, authorId: string) {
    const post = new BlogPost({
      ...postData,
      author: authorId,
      status: postData.status || 'draft'
    });
    await post.save();
    return post.populate('author', 'username profile.avatar');
  }

  async updatePost(id: string, updateData: Partial<IBlogPost>, authorId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid post ID', 400);
    }

    const post = await BlogPost.findOne({ _id: id, author: authorId });
    if (!post) {
      throw new AppError('Blog post not found or unauthorized', 404);
    }

    Object.assign(post, updateData);
    await post.save();
    return post.populate('author', 'username profile.avatar');
  }

  async deletePost(id: string, authorId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid post ID', 400);
    }

    const post = await BlogPost.findOneAndDelete({ _id: id, author: authorId });
    if (!post) {
      throw new AppError('Blog post not found or unauthorized', 404);
    }
    return post;
  }

  async getPostsByTag(tag: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      BlogPost.find({ 
        tags: tag,
        status: 'published'
      })
        .populate('author', 'username profile.avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments({ tags: tag, status: 'published' })
    ]);

    return {
      posts,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    };
  }
}

export default new BlogService();