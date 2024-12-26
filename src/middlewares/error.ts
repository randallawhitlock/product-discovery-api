import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
import mongoose from 'mongoose';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err);

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map(error => error.message);
    res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: messages
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};