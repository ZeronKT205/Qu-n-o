import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Middleware factory that validates a request part against a Zod schema.
 * On success, replaces the original data with the parsed (coerced) value.
 * On failure, returns 400 with formatted validation errors.
 */
export function validate(schema: ZodSchema, target: ValidateTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        code: 'VALIDATION_ERROR',
        errors,
      });
      return;
    }

    // Replace with coerced/parsed data
    if (target === 'query') {
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        configurable: true,
      });
    } else if (target === 'params') {
      Object.defineProperty(req, 'params', {
        value: result.data,
        writable: true,
        configurable: true,
      });
    } else {
      req[target] = result.data;
    }
    next();
  };
}
