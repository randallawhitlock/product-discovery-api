import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from '../types';
import config from '../config';

const validateResult = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(error => error.msg);
    throw new AppError(messages.join('. '), 400);
  }
  next();
};

export const validateRegistration = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
    
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: config.passwordMinLength })
    .withMessage(`Password must be at least ${config.passwordMinLength} characters long`),

  validateResult
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
    
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),

  validateResult
];
export const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  
  body('thumbnail')
    .trim()
    .notEmpty()
    .withMessage('Thumbnail URL is required')
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .isArray()
    .withMessage('Category must be an array')
    .notEmpty()
    .withMessage('At least one category is required'),

  validateResult
];

export const validateBlogPost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 100 })
    .withMessage('Content must be at least 100 characters'),
  
  body('summary')
    .trim()
    .notEmpty()
    .withMessage('Summary is required')
    .isLength({ max: 500 })
    .withMessage('Summary cannot exceed 500 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  validateResult
];

export const validateUserUpdate = (
  body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid email format')
  .normalizeEmail(),
  
body('password')
  .trim()
  .notEmpty()
  .withMessage('Password is required'),

validateResult
);
