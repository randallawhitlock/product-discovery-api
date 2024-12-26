import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { AppError } from '../types';
import config from '../config';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.window,
  max: (req: Request): number => {
    if (req.user?.role === 'admin') return config.rateLimit.maxRequests.admin;
    return config.rateLimit.maxRequests.default;
  },
  handler: (_req: Request, _res: Response) => {
    throw new AppError('Too many requests', 429);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: config.rateLimit.maxRequests.auth,
  handler: (_req: Request, _res: Response) => {
    throw new AppError('Too many login attempts', 429);
  },
  standardHeaders: true,
  legacyHeaders: false,
});