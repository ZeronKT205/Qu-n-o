'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  type User,
  type AuthTokens,
  tokenStorage,
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetMe,
  apiRefresh,
} from '@/utils/authService';

// ── Context Types ──────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, full_name: string, phone?: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: try to restore session from stored tokens
  useEffect(() => {
    async function restoreSession() {
      const accessToken = tokenStorage.getAccess();
      const refreshToken = tokenStorage.getRefresh();

      if (!accessToken && !refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Try fetching user with current access token
        const me = await apiGetMe();
        setUser(me);
      } catch {
        // Access token expired — try refresh
        if (refreshToken) {
          try {
            const newTokens = await apiRefresh(refreshToken);
            tokenStorage.set(newTokens);
            const me = await apiGetMe();
            setUser(me);
          } catch {
            // Refresh also failed — clear session
            tokenStorage.clear();
            setUser(null);
          }
        } else {
          tokenStorage.clear();
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password);
    tokenStorage.set(result.tokens);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    full_name: string,
    phone?: string
  ) => {
    const result = await apiRegister(email, password, full_name, phone);
    tokenStorage.set(result.tokens);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefresh();
    if (refreshToken) {
      try {
        await apiLogout(refreshToken);
      } catch {
        // ignore errors on logout
      }
    }
    tokenStorage.clear();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await apiGetMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: !!user && (user.role === 'admin' || user.role === 'super_admin'),
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
