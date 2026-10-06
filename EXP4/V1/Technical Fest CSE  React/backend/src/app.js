import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env.js';
import { sanitize } from './middleware/sanitize.js';
import { globalLimiter } from './middleware/rateLimiters.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (env.trustProxy) app.set('trust proxy', env.trustProxy);

  // Uploaded images are embedded by the frontend on a different origin.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  app.use(
    cors({
      origin(origin, cb) {
        // No Origin header = curl / Postman / server-to-server.
        const allowed = !origin || env.clientOrigins.includes('*') || env.clientOrigins.includes(origin);
        cb(null, allowed);
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    })
  );

  app.use(compression());
  if (!env.isTest) app.use(morgan(env.isProd ? 'combined' : 'dev'));
  app.use(express.json({ limit: '100kb' }));
  app.use(sanitize);

  app.use('/uploads', express.static(env.uploadDir, { index: false, dotfiles: 'deny', maxAge: '7d' }));

  app.get('/', (_req, res) =>
    res.json({
      success: true,
      data: { name: "HASH '27 API", version: '1.0.0', health: '/api/health', docs: 'See README.md and postman/ collection' },
    })
  );

  app.use('/api', globalLimiter, apiRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
