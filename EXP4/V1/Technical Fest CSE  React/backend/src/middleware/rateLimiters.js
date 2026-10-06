import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const make = (limit, windowMs, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: () => env.rateLimitDisabled || env.isTest,
    handler: (_req, res) =>
      res.status(429).json({ success: false, error: { code: 'RATE_LIMITED', message } }),
  });

const MIN = 60 * 1000;
export const globalLimiter = make(300, 15 * MIN, 'Too many requests, please slow down.');
export const loginLimiter = make(10, 15 * MIN, 'Too many login attempts. Try again in 15 minutes.');
export const registerLimiter = make(20, 60 * MIN, 'Too many registration attempts. Try again later.');
export const contactLimiter = make(5, 60 * MIN, 'Too many messages sent. Try again later.');
export const signupLimiter = make(10, 60 * MIN, 'Too many signup attempts. Try again later.');
