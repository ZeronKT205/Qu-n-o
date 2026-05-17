import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getSupabase } from '../config/supabase';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import type { LoginInput, RegisterInput, ChangePasswordInput } from '../validators/auth.validator';
import type { User, AuthTokenPayload, AuthTokens, AuthResponse } from '../types/auth.types';

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRES_SECONDS = 15 * 60;       // 15 minutes
const REFRESH_TOKEN_EXPIRES_DAYS = 7;

// ── Token helpers ──────────────────────────────────────────────────────────────

function signAccessToken(user: User): string {
  const payload: AuthTokenPayload = { sub: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions);
}

async function createRefreshToken(userId: string): Promise<string> {
  const supabase = getSupabase();
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  const { error } = await supabase.from('refresh_tokens').insert({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
  });

  if (error) throw ApiError.internal('Không thể tạo refresh token');
  return token;
}

function buildUserResponse(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    phone: row.phone as string | null,
    full_name: row.full_name as string,
    avatar_url: row.avatar_url as string | null,
    role: row.role as User['role'],
    email_verified: row.email_verified as boolean,
    is_active: row.is_active as boolean,
    created_at: row.created_at as string,
  };
}

// ── Service methods ────────────────────────────────────────────────────────────

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const supabase = getSupabase();

  // Check duplicate email
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', input.email)
    .eq('is_deleted', false)
    .maybeSingle();

  if (existing) throw ApiError.conflict('Email này đã được sử dụng', 'EMAIL_TAKEN');

  // Hash password
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS);

  // Insert user
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email: input.email,
      password_hash,
      full_name: input.full_name,
      phone: input.phone ?? null,
      role: 'customer',
    })
    .select('id, email, phone, full_name, avatar_url, role, email_verified, is_active, created_at')
    .single();

  if (error || !user) throw ApiError.internal('Không thể tạo tài khoản');

  const userObj = buildUserResponse(user);
  const accessToken = signAccessToken(userObj);
  const refreshToken = await createRefreshToken(userObj.id);

  return {
    user: userObj,
    tokens: { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_EXPIRES_SECONDS },
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const supabase = getSupabase();

  const { data: user } = await supabase
    .from('users')
    .select('id, email, phone, full_name, avatar_url, role, email_verified, is_active, is_deleted, password_hash, created_at')
    .eq('email', input.email)
    .eq('is_deleted', false)
    .maybeSingle();

  if (!user) throw ApiError.unauthorized('Email hoặc mật khẩu không đúng');
  if (!user.is_active) throw ApiError.forbidden('Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ');

  const isValid = await bcrypt.compare(input.password, user.password_hash as string);
  if (!isValid) throw ApiError.unauthorized('Email hoặc mật khẩu không đúng');

  // Update last_login_at
  await supabase.from('users').update({ last_login_at: new Date().toISOString() }).eq('id', user.id);

  const userObj = buildUserResponse(user);
  const accessToken = signAccessToken(userObj);
  const refreshToken = await createRefreshToken(userObj.id);

  return {
    user: userObj,
    tokens: { accessToken, refreshToken, expiresIn: ACCESS_TOKEN_EXPIRES_SECONDS },
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const supabase = getSupabase();

  const { data: tokenRecord } = await supabase
    .from('refresh_tokens')
    .select('id, user_id, expires_at, is_revoked')
    .eq('token', refreshToken)
    .maybeSingle();

  if (!tokenRecord) throw ApiError.unauthorized('Refresh token không hợp lệ');
  if (tokenRecord.is_revoked) throw ApiError.unauthorized('Refresh token đã bị thu hồi');
  if (new Date(tokenRecord.expires_at as string) < new Date()) {
    throw ApiError.unauthorized('Refresh token đã hết hạn. Vui lòng đăng nhập lại');
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, email, phone, full_name, avatar_url, role, email_verified, is_active, created_at')
    .eq('id', tokenRecord.user_id)
    .eq('is_deleted', false)
    .maybeSingle();

  if (!user || !user.is_active) throw ApiError.unauthorized('Tài khoản không hợp lệ');

  // Rotate: revoke old, create new
  await supabase.from('refresh_tokens').update({ is_revoked: true }).eq('id', tokenRecord.id);

  const userObj = buildUserResponse(user);
  const newAccessToken = signAccessToken(userObj);
  const newRefreshToken = await createRefreshToken(userObj.id);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn: ACCESS_TOKEN_EXPIRES_SECONDS };
}

export async function logout(refreshToken: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.from('refresh_tokens').update({ is_revoked: true }).eq('token', refreshToken);
}

export async function getMe(userId: string): Promise<User> {
  const supabase = getSupabase();
  const { data: user } = await supabase
    .from('users')
    .select('id, email, phone, full_name, avatar_url, role, email_verified, is_active, created_at')
    .eq('id', userId)
    .eq('is_deleted', false)
    .maybeSingle();

  if (!user) throw ApiError.notFound('Người dùng không tồn tại');
  return buildUserResponse(user);
}

export async function changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
  const supabase = getSupabase();
  const { data: user } = await supabase
    .from('users')
    .select('password_hash')
    .eq('id', userId)
    .eq('is_deleted', false)
    .maybeSingle();

  if (!user) throw ApiError.notFound('Người dùng không tồn tại');

  const isValid = await bcrypt.compare(input.old_password, user.password_hash as string);
  if (!isValid) throw ApiError.unauthorized('Mật khẩu cũ không chính xác');

  const password_hash = await bcrypt.hash(input.new_password, SALT_ROUNDS);
  const { error } = await supabase
    .from('users')
    .update({ password_hash })
    .eq('id', userId);

  if (error) throw ApiError.internal('Không thể cập nhật mật khẩu');
}
