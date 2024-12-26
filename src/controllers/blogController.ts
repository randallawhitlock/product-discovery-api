import { Request, Response, NextFunction } from 'express';
import blogService from '../services/blogService';

interface RequestWithQuery extends Request {
  query: {
    page?: string;
    limit?: string;
    status?: string;
  };
}

interface RequestWithParams extends Request {
  params: {
    id: string;
    tag?: string;
  };
  user?: {
    id: string; email: string; role: string;
  };
}

interface BlogPostBody {
  title: string;
  content: string;
  summary: string;
  tags?: string[];
}

interface RequestWithBody<T = any> extends Request {
  body: T;
  user?: {
    id: string; email: string; role: string;
  };
}

class BlogController {
  async getAllPosts(
    req: RequestWithQuery,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page || '1');
      const limit = parseInt(req.query.limit || '10');
      const queryStatus = req.query.status || 'published';

      let status = 'published';
      if (req.user?.role === 'admin' && queryStatus) {
        // Admin can filter by status if specified
        status =  queryStatus;
      }

      const result = await blogService.getAllPosts(page, limit, status);
      res.status(200).json(result);
    } catch (error) {
      next(error); 
    }
  }

  async getPostById(
    req: RequestWithParams,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const post = await blogService.getPostById(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error); 
    }
  }

  async createPost(
    req: RequestWithBody<BlogPostBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const post = await blogService.createPost(req.body, userId);
      res.status(201).json(post);
    } catch (error) {
      next(error); 
    }
  }

  async updatePost(
    req: RequestWithParams & RequestWithBody<BlogPostBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const post = await blogService.updatePost(req.params.id, req.body, userId);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(
    req: RequestWithParams,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      await blogService.deletePost(req.params.id, userId); 
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  async getPostsByTag(
    req: RequestWithParams & RequestWithQuery,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page || '1');
      const limit = parseInt(req.query.limit || '10');
      const posts = await blogService.getPostsByTag(req.params.tag || '', page, limit);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
}

export default new BlogController();
