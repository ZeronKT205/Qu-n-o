import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import type { AuthTokenPayload } from '../types/auth.types';
import { UserRole } from '../types/enums';

// Extend Express Request to carry the decoded JWT payload
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

/**
 * requireAuth — validates JWT from Authorization header.
 * Attaches decoded payload to req.user on success.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Bạn cần đăng nhập để thực hiện thao tác này'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại', 'TOKEN_EXPIRED'));
    }
    return next(ApiError.unauthorized('Token không hợp lệ', 'INVALID_TOKEN'));
  }
}

/**
 * requireRole — grants access only to specified roles.
 * Must be used AFTER requireAuth.
 */
export function requireRole(...roles: (UserRole | string)[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Bạn cần đăng nhập'));
    }

    const userRole = String(req.user.role);
    if (!roles.map(String).includes(userRole)) {
      return next(ApiError.forbidden(`Bạn không có quyền truy cập. Yêu cầu role: ${roles.join(' hoặc ')}`));
    }

    next();
  };
}

/** Shorthand: chỉ admin và super_admin */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  return requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN)(req, res, next);
}

/** Shorthand: chỉ super_admin */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction): void {
  return requireRole(UserRole.SUPER_ADMIN)(req, res, next);
}

