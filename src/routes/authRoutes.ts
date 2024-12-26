import express from 'express';
import { register, login, refreshToken, logout } from '../controllers/authController';
import { validateRegistration, validateLogin } from '../middlewares/validation';
import { authLimiter } from '../middlewares/rateLimit';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);

export default router;