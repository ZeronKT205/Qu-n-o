import { Response } from 'express';
import { ApiResponse as ApiResponseType, PaginatedResponse } from '../types';

/**
 * Standardized API response helpers.
 * Ensures consistent JSON format across all endpoints.
 */
export const ResponseHelper = {
  success<T>(res: Response, data: T, message = 'Success', status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data,
    } as ApiResponseType<T>);
  },

  created<T>(res: Response, data: T, message = 'Created successfully') {
    return ResponseHelper.success(res, data, message, 201);
  },

  paginated<T>(
    res: Response,
    data: T[],
    pagination: { page: number; limit: number; total: number },
    message = 'Success'
  ) {
    const { page, limit, total } = pagination;
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    } as PaginatedResponse<T>);
  },

  noContent(res: Response) {
    return res.status(204).send();
  },
};
