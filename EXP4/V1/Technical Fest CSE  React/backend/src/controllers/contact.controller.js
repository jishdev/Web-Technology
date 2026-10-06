import { ContactMessage } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler, created, escapeRegex, ok, paginationMeta } from '../utils/helpers.js';

export const create = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.create(req.body);
  return created(res, { id: msg.id, message: "Thanks! We've received your message and will get back to you soon." });
});

export const list = asyncHandler(async (req, res) => {
  const { status, q, page, limit } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    filter.$or = ['name', 'email', 'subject', 'message'].map((f) => ({ [f]: rx }));
  }
  const [items, total] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    ContactMessage.countDocuments(filter),
  ]);
  return ok(res, items, paginationMeta(page, limit, total));
});

export const getOne = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findById(req.params.id);
  if (!msg) throw ApiError.notFound('Message not found', 'MESSAGE_NOT_FOUND');
  return ok(res, msg);
});

export const update = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!msg) throw ApiError.notFound('Message not found', 'MESSAGE_NOT_FOUND');
  return ok(res, msg);
});

export const remove = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!msg) throw ApiError.notFound('Message not found', 'MESSAGE_NOT_FOUND');
  return ok(res, { deleted: true });
});
