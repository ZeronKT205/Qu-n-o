import { Router } from 'express';
import * as ProductController from '../controllers/product.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth, requireAdmin } from '../middlewares/auth';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../validators/product.validator';

const router = Router();

/**
 * Product Routes
 * Base path: /api/v1/products
 */

// GET /api/v1/products — List all products (with filter, sort, pagination)
router.get(
  '/',
  validate(productQuerySchema, 'query'),
  asyncHandler(ProductController.list)
);

// GET /api/v1/products/:slug — Get product detail by slug
router.get(
  '/:slug',
  asyncHandler(ProductController.getBySlug)
);

// POST /api/v1/products — Create new product (Admin only)
router.post(
  '/',
  requireAuth, requireAdmin,
  validate(createProductSchema, 'body'),
  asyncHandler(ProductController.create)
);

// PUT /api/v1/products/:id — Update product (Admin only)
router.put(
  '/:id',
  requireAuth, requireAdmin,
  validate(updateProductSchema, 'body'),
  asyncHandler(ProductController.update)
);

// DELETE /api/v1/products/:id — Soft delete product (Admin only)
router.delete(
  '/:id',
  requireAuth, requireAdmin,
  asyncHandler(ProductController.remove)
);

export default router;
