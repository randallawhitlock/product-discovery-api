import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../types';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    role: string;
  };
}

class AdminController {
  async getAllUsers(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find()
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments()
      ]);

      res.status(200).json({
        users,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: total
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      // List of fields that can be updated
      const allowedUpdates = [
        'username',
        'email',
        'role',
        'isActive',
        'profile.bio',
        'profile.avatar',
        'profile.social'
      ];

      // Filter out any fields that aren't in allowedUpdates
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = updates[key];
          return obj;
        }, {});

      const user = await User.findByIdAndUpdate(
        id,
        { $set: filteredUpdates },
        { 
          new: true,
          runValidators: true,
          select: '-password'
        }
      );

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();