import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth, requireAdmin } from '../middlewares/auth';
import * as AdminController from '../controllers/admin.controller';
import {
  dateRangeSchema,
  adminCustomerQuerySchema,
  updateCustomerSchema,
} from '../validators/admin.validator';

const router = Router();

// All admin routes require authentication + admin role
router.use(requireAuth, requireAdmin);

// GET /api/v1/admin/dashboard
router.get('/dashboard', asyncHandler(AdminController.dashboard));

// GET /api/v1/admin/reports?from_date=YYYY-MM-DD&to_date=YYYY-MM-DD
router.get('/reports', validate(dateRangeSchema, 'query'), asyncHandler(AdminController.reports));

// --- Customers ---
router.get('/customers', validate(adminCustomerQuerySchema, 'query'), asyncHandler(AdminController.listCustomers));
router.get('/customers/:id', asyncHandler(AdminController.getCustomer));
router.patch('/customers/:id', validate(updateCustomerSchema, 'body'), asyncHandler(AdminController.updateCustomer));
router.delete('/customers/:id', asyncHandler(AdminController.deleteCustomer));

export default router;
