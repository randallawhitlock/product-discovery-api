import mongoose from 'mongoose';
import { AppError } from '../types';

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGO_URI) {
      throw new AppError('MongoDB URI is not defined in environment variables', 500);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    mongoose.set('debug', process.env.NODE_ENV === 'development');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    throw new AppError('Database connection failed', 500);
  }
};

export default connectDB;