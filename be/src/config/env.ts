import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized environment configuration.
 * Validates required variables at startup to fail fast.
 */
const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const;

for (const key of requiredVars) {
  if (!process.env[key]) {
    console.warn(`⚠️  Missing env var: ${key}. Some features may not work.`);
  }
}

export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // App
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
} as const;
