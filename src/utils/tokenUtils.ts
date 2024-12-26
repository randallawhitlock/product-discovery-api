import jwt from "jsonwebtoken";
import config from '../config';
import { AppError } from '../types';

export const generateToken = (userId: string): string => {
  if (!config.jwtSecret) {
    throw new AppError('JWT secret is not configured', 500);
  }
  
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string) => {
  if (!config.jwtSecret) {
    throw new AppError('JWT secret is not configured', 500);
  }

  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    throw new AppError('Invalid or expired token', 401);
  }
};