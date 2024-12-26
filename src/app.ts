import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import blogRoutes from "./routes/blogRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from "./middlewares/error";
import { apiLimiter } from "./middlewares/rateLimit";

const app = express();

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Rate Limiting
app.use(apiLimiter);

// Body Parser
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use(errorHandler);

export default app;