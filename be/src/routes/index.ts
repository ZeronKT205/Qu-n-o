import { Router } from 'express';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import orderRoutes from './order.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';

const router = Router();

/**
 * API v1 — Route registry
 * All routes are prefixed with /api/v1
 */

// Public + Auth endpoints
router.use('/auth', authRoutes);

// Product & Category (public GET, protected mutations)
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

// Orders (requires auth — handled inside order.routes.ts)
router.use('/orders', orderRoutes);

// Admin dashboard, reports, and customer management
router.use('/admin', adminRoutes);

export default router;

