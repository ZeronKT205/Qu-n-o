import { Router } from 'express';
import * as CategoryController from '../controllers/category.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth, requireAdmin } from '../middlewares/auth';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
} from '../validators/category.validator';

const router = Router();

// GET /api/v1/categories
router.get(
  '/',
  validate(categoryQuerySchema, 'query'),
  asyncHandler(CategoryController.list)
);

// POST /api/v1/categories
router.post(
  '/',
  requireAuth, requireAdmin,
  validate(createCategorySchema, 'body'),
  asyncHandler(CategoryController.create)
);

// PUT /api/v1/categories/:id
router.put(
  '/:id',
  requireAuth, requireAdmin,
  validate(updateCategorySchema, 'body'),
  asyncHandler(CategoryController.update)
);

// DELETE /api/v1/categories/:id
router.delete(
  '/:id',
  requireAuth, requireAdmin,
  asyncHandler(CategoryController.remove)
);

export default router;
