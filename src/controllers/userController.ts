import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';

class UserController {
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserProfile(req.user!.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUserProfile(req.user!.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const wishlist = await userService.getWishlist(req.user!.id);
      res.json(wishlist);
    } catch (error) {
      next(error);
    }
  }

  async addToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const wishlist = await userService.addToWishlist(req.user!.id, req.params.productId);
      res.json(wishlist);
    } catch (error) {
      next(error);
    }
  }

  async removeFromWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const wishlist = await userService.removeFromWishlist(req.user!.id, req.params.productId);
      res.json(wishlist);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();