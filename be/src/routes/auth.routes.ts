import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';
import * as AuthController from '../controllers/auth.controller';
import { loginSchema, registerSchema, refreshTokenSchema, changePasswordSchema } from '../validators/auth.validator';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Body: { email, password, full_name, phone? }
 */
router.post('/register', validate(registerSchema), asyncHandler(AuthController.register));

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 */
router.post('/login', validate(loginSchema), asyncHandler(AuthController.login));

/**
 * POST /api/v1/auth/refresh
 * Body: { refresh_token }
 */
router.post('/refresh', validate(refreshTokenSchema), asyncHandler(AuthController.refresh));

/**
 * POST /api/v1/auth/logout
 * Body: { refresh_token }
 */
router.post('/logout', validate(refreshTokenSchema), asyncHandler(AuthController.logout));

/**
 * GET /api/v1/auth/me
 * Header: Authorization: Bearer <access_token>
 */
router.get('/me', requireAuth, asyncHandler(AuthController.me));

/**
 * POST /api/v1/auth/change-password
 * Header: Authorization: Bearer <access_token>
 * Body: { old_password, new_password }
 */
router.post('/change-password', requireAuth, validate(changePasswordSchema), asyncHandler(AuthController.changePassword));

export default router;
