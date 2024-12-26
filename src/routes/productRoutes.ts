import express from 'express';
import productController from '../controllers/productController';
import { validateProduct } from '../middlewares/validation';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Protected routes that require admin
router.use(authenticate, requireAdmin);
router.post('/', validateProduct, productController.createProduct);
router.put('/:id', validateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;