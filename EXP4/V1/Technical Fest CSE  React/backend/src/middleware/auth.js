import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin, User } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/helpers.js';

const getToken = (req) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token : null;
};

async function resolveAdmin(token) {
  const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
  if (payload.typ !== 'admin') throw ApiError.unauthorized('Wrong token type', 'INVALID_TOKEN');
  const admin = await Admin.findById(payload.sub);
  if (!admin) throw ApiError.unauthorized('Account no longer exists', 'INVALID_TOKEN');
  return admin;
}

async function resolveUser(token) {
  const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
  if (payload.typ !== 'user') throw ApiError.unauthorized('Wrong token type', 'INVALID_TOKEN');
  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('Account no longer exists', 'INVALID_TOKEN');
  return user;
}

/** Requires a valid admin JWT: Authorization: Bearer <token> */
export const requireAdmin = asyncHandler(async (req, _res, next) => {
  const token = getToken(req);
  if (!token) throw ApiError.unauthorized();
  try {
    req.admin = await resolveAdmin(token);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'TokenExpiredError') throw ApiError.unauthorized('Session expired, please log in again', 'TOKEN_EXPIRED');
    throw ApiError.unauthorized('Invalid token', 'INVALID_TOKEN');
  }
  next();
});

/** Attaches req.admin when a valid token is present; never rejects. */
export const optionalAdmin = asyncHandler(async (req, _res, next) => {
  const token = getToken(req);
  if (token) {
    try {
      req.admin = await resolveAdmin(token);
    } catch {
      /* treat as anonymous */
    }
  }
  next();
});

/** Requires a valid user JWT: Authorization: Bearer <token> */
export const requireUser = asyncHandler(async (req, _res, next) => {
  const token = getToken(req);
  if (!token) throw ApiError.unauthorized();
  try {
    req.user = await resolveUser(token);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'TokenExpiredError') throw ApiError.unauthorized('Session expired, please log in again', 'TOKEN_EXPIRED');
    throw ApiError.unauthorized('Invalid token', 'INVALID_TOKEN');
  }
  next();
});

/** Attaches req.user when a valid user token is present; never rejects. */
export const optionalUser = asyncHandler(async (req, _res, next) => {
  const token = getToken(req);
  if (token) {
    try {
      req.user = await resolveUser(token);
    } catch {
      /* treat as anonymous */
    }
  }
  next();
});
