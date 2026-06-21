import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import rentalsRoutes from './routes/rentals.js';
import adminRoutes from './routes/admin.js';
import manageRoutes from './routes/manage.js';
import houseRoutes from './routes/houses.js';
import authMiddleware from './middleware/authMiddleware.js';
import roleMiddleware from './middleware/roleMiddleware.js';
import { startMaintenanceWorker, stopMaintenanceWorker } from './utils/maintenance.js';

const app = express();

// ── Security headers ──────────────────────────────────────────────────
app.use(helmet());

// ── Compression ───────────────────────────────────────────────────────
// Gzip-compress all API responses (reduces bandwidth ~70%)
app.use(compression());

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }));

// Allow localhost:* and any private-network IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
// so the app works both on localhost and when accessed over the local network.
const PRIVATE_IP_RE = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/;

const getConfiguredOrigins = () =>
  (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const isSameHostRequest = (req: Request, origin: string) => {
  try {
    const parsedOrigin = new URL(origin);
    const forwardedHost = req.headers['x-forwarded-host'];
    const hostHeader = Array.isArray(forwardedHost)
      ? forwardedHost[0]
      : forwardedHost || req.headers.host;

    if (!hostHeader) {
      return false;
    }

    return parsedOrigin.host === hostHeader;
  } catch {
    return false;
  }
};

const isAllowedOrigin = (req: Request, origin?: string) => {
  if (!origin) {
    return true;
  }

  if (getConfiguredOrigins().includes(origin)) {
    return true;
  }

  if (PRIVATE_IP_RE.test(origin)) {
    return true;
  }

  return isSameHostRequest(req, origin);
};

app.use(
  cors((req, callback) => {
    const origin = req.header('origin');
    const allowed = isAllowedOrigin(req, origin);

    callback(null, {
      origin: allowed ? origin || true : false,
      credentials: true,
      optionsSuccessStatus: 204,
    });
  }),
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ── Rate limiting ─────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests — please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts — please try again later.' },
});

app.use('/api', generalLimiter);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'camera-rental-house-server',
    requestId: crypto.randomUUID(),
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/rentals', authMiddleware, roleMiddleware(['user', 'admin', 'manager', 'staff']), rentalsRoutes);
app.use('/api/manage', authMiddleware, roleMiddleware(['admin', 'manager', 'staff']), manageRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/admin/houses', authMiddleware, roleMiddleware(['admin', 'manager', 'staff']), houseRoutes);

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('SERVER ERROR:', error);
  return res.status(500).json({
    message: error?.message || 'Internal server error.',
    ...(process.env.NODE_ENV !== 'production' && { error }),
  });
});

export default app;

// ── Process-level error handlers ──────────────────────────────────────
// Prevents silent crash on unhandled rejections / exceptions.
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  // Give logger time to flush, then exit (process is in unknown state)
  setTimeout(() => process.exit(1), 1000);
});

// ── Graceful shutdown ─────────────────────────────────────────────────
// Close the HTTP server and let in-flight requests finish, then exit.
const shutdown = (signal: string) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  stopMaintenanceWorker();
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  // Force exit if graceful close takes too long
  setTimeout(() => {
    console.error('Forced exit after shutdown timeout.');
    process.exit(1);
  }, 30_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Server start ──────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 5000;

// Listen on 0.0.0.0 so the server is reachable from other devices on the LAN
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Camera Rental House server listening on http://0.0.0.0:${port}`);

  // Start background maintenance worker
  startMaintenanceWorker();
});
server.timeout = 300000;
server.keepAliveTimeout = 300000;
