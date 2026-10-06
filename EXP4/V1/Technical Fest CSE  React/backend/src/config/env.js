import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const DEV_SECRET = 'dev-only-secret-do-not-use-in-production-0123456789';
let jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  if (isProd) {
    console.error('FATAL: JWT_SECRET must be set (min 32 chars) when NODE_ENV=production');
    process.exit(1);
  }
  console.warn('[env] JWT_SECRET missing/short - using an insecure dev secret. Do NOT deploy like this.');
  jwtSecret = DEV_SECRET;
}

const list = (value, fallback) =>
  (value ?? fallback)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const env = {
  nodeEnv,
  isProd,
  isTest: nodeEnv === 'test',
  port: Number(process.env.PORT) || 5000,
  trustProxy: process.env.TRUST_PROXY === '1' || process.env.TRUST_PROXY === 'true' ? 1 : 0,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hash27',
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  adminUsername: (process.env.ADMIN_USERNAME || 'admin').toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe@2027',
  clientOrigins: list(process.env.CLIENT_ORIGINS, 'http://localhost:5173,http://127.0.0.1:5173'),
  uploadDir: path.resolve(process.env.UPLOAD_DIR || 'uploads'),
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 5,
  rateLimitDisabled: process.env.RATE_LIMIT_DISABLED === 'true',
};
