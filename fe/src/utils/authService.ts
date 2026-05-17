// ============================================
// AUTH API SERVICE
// Kết nối tới backend /api/v1/auth/*
// ============================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export type UserRole = 'customer' | 'admin' | 'super_admin';

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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ── Token Storage (localStorage) ───────────────────────────────────────────────

const ACCESS_KEY = 'lv_access_token';
const REFRESH_KEY = 'lv_refresh_token';

export const tokenStorage = {
  getAccess: () => (typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null),
  getRefresh: () => (typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null),
  set: (tokens: AuthTokens) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ── API helpers ────────────────────────────────────────────────────────────────

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  withAuth = false
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (withAuth) {
    const token = tokenStorage.getAccess();
    if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const json = await res.json();

  if (!res.ok) {
    // Prefer first field-level validation error over generic message
    const detail = json.errors?.[0]?.message;
    throw new Error(detail || json.message || 'Có lỗi xảy ra');
  }

  return json.data as T;
}

// ── Auth API calls ─────────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiRegister(
  email: string,
  password: string,
  full_name: string,
  phone?: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name, phone }),
  });
}

export async function apiRefresh(refresh_token: string): Promise<AuthTokens> {
  return apiRequest<AuthTokens>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token }),
  });
}

export async function apiLogout(refresh_token: string): Promise<void> {
  await apiRequest('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refresh_token }),
  });
}

export async function apiGetMe(): Promise<User> {
  return apiRequest<User>('/auth/me', {}, true);
}

export async function apiChangePassword(old_password: string, new_password: string): Promise<void> {
  await apiRequest<void>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ old_password, new_password }),
  }, true);
}
