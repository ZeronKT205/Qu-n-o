/**
 * Custom operational error class.
 * Distinguishes expected errors (4xx) from unexpected crashes (5xx).
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(status: number, message: string, code = 'ERROR', isOperational = true) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.isOperational = isOperational;

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // ── Factory helpers ──────────────────────────────────
  static badRequest(message: string, code = 'BAD_REQUEST') {
    return new ApiError(400, message, code);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new ApiError(401, message, code);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
    return new ApiError(403, message, code);
  }

  static notFound(message: string, code = 'NOT_FOUND') {
    return new ApiError(404, message, code);
  }

  static conflict(message: string, code = 'CONFLICT') {
    return new ApiError(409, message, code);
  }

  static internal(message = 'Internal Server Error', code = 'INTERNAL_ERROR') {
    return new ApiError(500, message, code, false);
  }
}
