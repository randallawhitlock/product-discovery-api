// src/routes/adminRoutes.ts
import express from 'express';
import adminController from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { validateUserUpdate } from '../middlewares/validation';

const router = express.Router();

// Protect all admin routes
router.use(authenticate, requireAdmin);

// User management routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', validateUserUpdate, adminController.updateUser);

export default router;