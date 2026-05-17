import { Router } from 'express';
import * as OrderController from '../controllers/order.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth, requireAdmin } from '../middlewares/auth';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
} from '../validators/order.validator';

const router = Router();

// GET /api/v1/orders
router.get(
  '/',
  validate(orderQuerySchema, 'query'),
  asyncHandler(OrderController.list)
);

// GET /api/v1/orders/:id
router.get(
  '/:id',
  asyncHandler(OrderController.getById)
);

// GET /api/v1/orders/number/:orderNumber
router.get(
  '/number/:orderNumber',
  asyncHandler(OrderController.getByNumber)
);

// POST /api/v1/orders
router.post(
  '/',
  validate(createOrderSchema, 'body'),
  asyncHandler(OrderController.create)
);

// PATCH /api/v1/orders/:id/status — admin only
router.patch(
  '/:id/status',
  requireAuth,
  requireAdmin,
  validate(updateOrderStatusSchema, 'body'),
  asyncHandler(OrderController.updateStatus)
);

export default router;
