import dotenv from 'dotenv';
import { AppError } from '../types';

dotenv.config();

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'NODE_ENV'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new AppError(`Missing required environment variable: ${envVar}`, 500);
  }
});

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // App settings
  passwordMinLength: 6,
  passwordMaxLength: 128,
  usernameMinLength: 3,
  usernameMaxLength: 30,
  
  // Rate limiting
  rateLimit: {
    window: 15 * 60 * 1000, // 15 minutes
    maxRequests: {
      default: 100,
      auth: 5,
      admin: 1000
    }
  },
  
  // Pagination defaults
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  }
};