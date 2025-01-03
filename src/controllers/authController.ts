import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import { AppError } from '../types';

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface TokenRequest {
  refreshToken: string;
}

export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const tokensAndUser = await authService.register({ email, password }); // Removed username
    res.status(201).json({
      message: 'User registered successfully',
      ...tokensAndUser
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const tokensAndUser = await authService.login(email, password);
    res.json(tokensAndUser);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request<{}, {}, TokenRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }
    const tokens = await authService.refreshToken(refreshToken);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request<{}, {}, TokenRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }
    if (!req.user?.id) {
      throw new AppError('User not authenticated', 401);
    }
    await authService.logout(req.user.id, refreshToken);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};