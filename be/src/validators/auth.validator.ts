import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 chữ số'),
  full_name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự').max(100),
  phone: z
    .string()
    .regex(/^(0|\+84)[3-9]\d{8}$/, 'Số điện thoại không hợp lệ')
    .optional(),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token bắt buộc'),
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Mật khẩu cũ bắt buộc'),
  new_password: z
    .string()
    .min(8, 'Mật khẩu mới tối thiểu 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu mới phải có ít nhất 1 chữ hoa')
    .regex(/[0-9]/, 'Mật khẩu mới phải có ít nhất 1 chữ số'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
