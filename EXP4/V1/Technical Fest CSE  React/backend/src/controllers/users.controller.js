import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User, Registration } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler, created, ok } from '../utils/helpers.js';

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);
const USER_TOKEN_TTL = '30d';

const signUserToken = (user) =>
  jwt.sign({ sub: user.id, typ: 'user' }, env.jwtSecret, { algorithm: 'HS256', expiresIn: USER_TOKEN_TTL });

const authPayload = (user) => ({ token: signUserToken(user), tokenType: 'Bearer', expiresIn: USER_TOKEN_TTL, user: user.toJSON() });

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone, institution } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists', 'EMAIL_TAKEN');

  const user = await User.create({
    name,
    email,
    phone: phone || undefined,
    institution: institution || undefined,
    passwordHash: await User.hashPassword(password),
    lastLoginAt: new Date(),
  });

  return created(res, authPayload(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');

  let valid = false;
  if (user) valid = await user.verifyPassword(password);
  else await bcrypt.compare(password, DUMMY_HASH);

  if (!valid) throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');

  await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
  return ok(res, authPayload(user));
});

export const me = asyncHandler(async (req, res) => ok(res, req.user));

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, institution } = req.body;
  const user = await User.findById(req.user.id);
  user.set({ name, phone: phone || undefined, institution: institution || undefined });
  await user.save();
  return ok(res, user);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+passwordHash');
  if (!(await user.verifyPassword(currentPassword))) {
    throw ApiError.badRequest('Current password is incorrect', undefined, 'INVALID_CREDENTIALS');
  }
  user.passwordHash = await User.hashPassword(newPassword);
  await user.save();
  return ok(res, { message: 'Password updated' });
});

// Registrations made by this account, newest first.
export const myRegistrations = asyncHandler(async (req, res) => {
  const items = await Registration.find({ user: req.user.id })
    .populate('event', 'slug title day time venue')
    .sort({ createdAt: -1 });
  return ok(res, items, { count: items.length });
});
