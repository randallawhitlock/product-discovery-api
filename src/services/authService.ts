import jwt from 'jsonwebtoken';
import { AppError } from '../types';
import User from '../models/User';
import RefreshToken from '../models/RefreshToken';

class AuthService {
  private readonly JWT_ACCESS_EXPIRES = '15m';
  private readonly JWT_REFRESH_EXPIRES = '7d';

  private generateAccessToken(payload: { id: string; email: string; role: string }): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError('JWT secret is not configured', 500);
    }
    return jwt.sign(payload, secret, { expiresIn: this.JWT_ACCESS_EXPIRES });
  }

  private generateRefreshToken(payload: { id: string }): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new AppError('JWT refresh secret is not configured', 500);
    }
    return jwt.sign(payload, secret, { expiresIn: this.JWT_REFRESH_EXPIRES });
  }

  async register(userData: { email: string; password: string }) {
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    const user = new User({
      email: userData.email,
      password: userData.password,
      role: 'user'
    });

    await user.save();
    return {
      ...(await this.generateTokens(user)),
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    }
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    user.lastLogin = new Date();
    await user.save();

    return {
      ...(await this.generateTokens(user)),
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) {
        throw new AppError('JWT refresh secret is not configured', 500);
      }

      const decoded = jwt.verify(refreshToken, secret) as { id: string };
      
      const storedToken = await RefreshToken.findOne({ 
        userId: decoded.id,
        token: refreshToken
      });
      
      if (!storedToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new AppError('User not found or inactive', 404);
      }

      await RefreshToken.deleteOne({ _id: storedToken._id });
      return this.generateTokens(user);
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(userId: string, refreshToken: string) {
    await RefreshToken.deleteOne({ userId, token: refreshToken });
  }

  async logoutAll(userId: string) {
    await RefreshToken.deleteMany({ userId });
  }

  private async generateTokens(user: any) {
    const accessToken = this.generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    const refreshToken = this.generateRefreshToken({ id: user._id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt
    });

    return { accessToken, refreshToken };
  }
}

export default new AuthService();