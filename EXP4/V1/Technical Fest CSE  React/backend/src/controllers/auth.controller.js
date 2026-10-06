import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { Admin } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler, ok } from '../utils/helpers.js';

// Compared against when the username does not exist, so response time doesn't reveal valid usernames.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username }).select('+passwordHash');

  let valid = false;
  if (admin) valid = await admin.verifyPassword(password);
  else await bcrypt.compare(password, DUMMY_HASH);

  if (!valid) throw ApiError.unauthorized('Invalid username or password', 'INVALID_CREDENTIALS');

  await Admin.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });

  const token = jwt.sign({ sub: admin.id, typ: 'admin' }, env.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: env.jwtExpiresIn,
  });

  return ok(res, { token, tokenType: 'Bearer', expiresIn: env.jwtExpiresIn, admin: admin.toJSON() });
});

export const me = asyncHandler(async (req, res) => ok(res, req.admin));

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin.id).select('+passwordHash');
  if (!(await admin.verifyPassword(currentPassword))) {
    throw ApiError.badRequest('Current password is incorrect', undefined, 'INVALID_CREDENTIALS');
  }
  admin.passwordHash = await Admin.hashPassword(newPassword);
  await admin.save();
  return ok(res, { message: 'Password updated' });
});
