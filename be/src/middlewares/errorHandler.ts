import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

/**
 * Global error handler — must be registered last in Express.
 * Formats all errors into a consistent JSON response.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof ApiError && err.isOperational) {
    // Known operational error — safe to expose to client
    res.status(err.status).json({
      success: false,
      message: err.message,
      code: err.code,
    });
    return;
  }

  // Unknown / programming error — log and hide details from client
  logger.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
    code: 'INTERNAL_ERROR',
  });
}
