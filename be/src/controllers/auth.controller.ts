import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { ResponseHelper } from '../utils/ApiResponse';
import type { LoginInput, RegisterInput, RefreshTokenInput, ChangePasswordInput } from '../validators/auth.validator';

// POST /auth/register
export async function register(req: Request, res: Response): Promise<void> {
  const input = req.body as RegisterInput;
  const result = await AuthService.register(input);
  ResponseHelper.created(res, result, 'Đăng ký tài khoản thành công');
}

// POST /auth/login
export async function login(req: Request, res: Response): Promise<void> {
  const input = req.body as LoginInput;
  const result = await AuthService.login(input);
  ResponseHelper.success(res, result, 'Đăng nhập thành công');
}

// POST /auth/refresh
export async function refresh(req: Request, res: Response): Promise<void> {
  const { refresh_token } = req.body as RefreshTokenInput;
  const tokens = await AuthService.refreshAccessToken(refresh_token);
  ResponseHelper.success(res, tokens, 'Làm mới token thành công');
}

// POST /auth/logout
export async function logout(req: Request, res: Response): Promise<void> {
  const { refresh_token } = req.body as RefreshTokenInput;
  await AuthService.logout(refresh_token);
  ResponseHelper.noContent(res);
}

// GET /auth/me  (requires auth middleware)
export async function me(req: Request, res: Response): Promise<void> {
  const userId = (req as Request & { user?: { sub: string } }).user!.sub;
  const user = await AuthService.getMe(userId);
  ResponseHelper.success(res, user, 'Lấy thông tin tài khoản thành công');
}

// POST /auth/change-password  (requires auth middleware)
export async function changePassword(req: Request, res: Response): Promise<void> {
  const userId = (req as Request & { user?: { sub: string } }).user!.sub;
  const input = req.body as ChangePasswordInput;
  await AuthService.changePassword(userId, input);
  ResponseHelper.success(res, null, 'Thay đổi mật khẩu thành công');
}
