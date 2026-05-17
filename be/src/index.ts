import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app: Express = express();

// ── Security & Parsing Middlewares ────────────────
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'Levents Backend is running',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// ── API Routes ────────────────────────────────────
app.use('/api/v1', apiRoutes);

// ── 404 Handler ───────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint không tồn tại',
    code: 'NOT_FOUND',
  });
});

// ── Global Error Handler (must be last) ───────────
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// ── Start Server ──────────────────────────────────
app.listen(env.PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${env.PORT}`);
  logger.info(`📌 Environment: ${env.NODE_ENV}`);
  logger.info(`🔗 Supabase URL: ${env.SUPABASE_URL || '(not configured)'}`);
});

