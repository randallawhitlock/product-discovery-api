import express from 'express';
import userController from '../controllers/userController';
import { authenticate } from '../middlewares/auth';
import { validateUserUpdate } from '../middlewares/validation';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', userController.getUserProfile);
router.put('/profile', validateUserUpdate, userController.updateUserProfile);

router.get('/wishlist', userController.getWishlist);
router.post('/wishlist/:productId', userController.addToWishlist);
router.delete('/wishlist/:productId', userController.removeFromWishlist);

export default router;