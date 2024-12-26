import express from 'express';
import blogController from '../controllers/blogController';
import { validateBlogPost } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', blogController.getAllPosts);
router.get('/tag/:tag', blogController.getPostsByTag);
router.get('/:id', blogController.getPostById);

// Protected routes
router.use(authenticate);
router.post('/', validateBlogPost, blogController.createPost);
router.put('/:id', validateBlogPost, blogController.updatePost);
router.delete('/:id', blogController.deletePost);

export default router;