// ============================================
// AUTH TYPE DEFINITIONS
// ============================================

import { UserRole } from './enums';

export interface User {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface AuthTokenPayload {
  sub: string;         // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
