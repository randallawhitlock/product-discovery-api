import { AppError } from '../types';
import User from '../models/User';
import { Types } from 'mongoose';

class UserService {
  async getUserProfile(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    const user = await User.findById(userId)
      .select('-password')
      .populate('wishlist')
      .lean();
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    return user;
  }

  async updateUserProfile(userId: string, updateData: any) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    const allowedUpdates = [
      'username',
      'profile.bio',
      'profile.avatar',
      'profile.social'
    ];

    const updates = Object.keys(updateData)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async getWishlist(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user ID', 400);
    }

    const user = await User.findById(userId)
      .select('wishlist')
      .populate('wishlist')
      .lean();
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user.wishlist;
  }

  async addToWishlist(userId: string, productId: string) {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
      throw new AppError('Invalid user or product ID', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.wishlist.includes(new Types.ObjectId(productId))) {
      user.wishlist.push(new Types.ObjectId(productId));
      await user.save();
    }

    return user.wishlist;
  }

  async removeFromWishlist(userId: string, productId: string) {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
      throw new AppError('Invalid user or product ID', 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    return user.wishlist;
  }
}

export default new UserService();