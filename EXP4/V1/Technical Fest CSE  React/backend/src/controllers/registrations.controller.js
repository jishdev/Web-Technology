import { Event, Registration, Setting } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import {
  asyncHandler,
  created,
  escapeRegex,
  generateRegistrationCode,
  ok,
  paginationMeta,
} from '../utils/helpers.js';
import { findEventByIdOrSlug } from './events.controller.js';

const POPULATE = 'slug title day time venue';
const SORTS = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, name: { name: 1 } };

/**
 * Atomically takes one seat. The capacity check lives inside the update filter,
 * so two concurrent requests can never both grab the last seat.
 */
async function reserveSeat(event) {
  const filter = event.capacity > 0 ? { _id: event._id, registeredCount: { $lt: event.capacity } } : { _id: event._id };
  const updated = await Event.findOneAndUpdate(filter, { $inc: { registeredCount: 1 } }, { new: true });
  return Boolean(updated);
}

const releaseSeat = (eventId) =>
  Event.updateOne({ _id: eventId, registeredCount: { $gt: 0 } }, { $inc: { registeredCount: -1 } });

async function buildFilter({ event, status, year, q }) {
  const filter = {};
  if (event) {
    const ev = await findEventByIdOrSlug(event);
    filter.event = ev ? ev._id : null; // unknown event -> no results
  }
  if (status) filter.status = status;
  if (year) filter.year = year;
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    filter.$or = ['name', 'email', 'phone', 'code', 'department', 'institution', 'teamName'].map((f) => ({ [f]: rx }));
  }
  return filter;
}

const publicShape = (reg, event) => ({
  id: reg.id,
  code: reg.code,
  status: reg.status,
  name: reg.name,
  email: reg.email,
  event: { id: event.id, slug: event.slug, title: event.title, day: event.day, time: event.time, venue: event.venue },
  createdAt: reg.createdAt,
});

/* ---------------- public ---------------- */

export const create = asyncHandler(async (req, res) => {
  const site = await Setting.getSite();
  if (!site.isRegistrationOpen()) {
    throw new ApiError(403, 'REGISTRATION_CLOSED', 'Registrations are currently closed');
  }

  const { event: eventKey, teamName, ...fields } = req.body;
  const event = await findEventByIdOrSlug(eventKey);
  if (!event) throw ApiError.notFound('Event not found', 'EVENT_NOT_FOUND');
  if (!event.isActive) throw new ApiError(403, 'EVENT_CLOSED', 'Registrations are closed for this event');

  const existing = await Registration.findOne({ event: event._id, email: fields.email });
  if (existing && existing.status !== 'cancelled') {
    throw ApiError.conflict('This email is already registered for this event', 'ALREADY_REGISTERED');
  }

  if (!(await reserveSeat(event))) throw ApiError.conflict('This event is full', 'EVENT_FULL');

  try {
    let reg;
    if (existing) {
      // Re-registering after a cancellation revives the old record (keeps its code).
      existing.set({ ...fields, teamName: teamName || undefined, status: 'confirmed', user: req.user?.id || existing.user });
      reg = await existing.save();
    } else {
      for (let attempt = 0; ; attempt += 1) {
        try {
          reg = await Registration.create({
            ...fields,
            teamName: teamName || undefined,
            event: event._id,
            user: req.user?.id || null,
            code: generateRegistrationCode(),
          });
          break;
        } catch (err) {
          const codeClash = err?.code === 11000 && err.keyPattern?.code;
          if (!codeClash || attempt >= 2) throw err;
        }
      }
    }
    return created(res, publicShape(reg, event));
  } catch (err) {
    await releaseSeat(event._id);
    if (err?.code === 11000) {
      throw ApiError.conflict('This email is already registered for this event', 'ALREADY_REGISTERED');
    }
    throw err;
  }
});

/* ---------------- admin ---------------- */

export const list = asyncHandler(async (req, res) => {
  const { sort, page, limit } = req.query;
  const filter = await buildFilter(req.query);
  const [items, total] = await Promise.all([
    Registration.find(filter)
      .populate('event', POPULATE)
      .sort(SORTS[sort])
      .skip((page - 1) * limit)
      .limit(limit),
    Registration.countDocuments(filter),
  ]);
  return ok(res, items, paginationMeta(page, limit, total));
});

const csvCell = (value) => {
  let s = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // neutralise spreadsheet formula injection
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const exportCsv = asyncHandler(async (req, res) => {
  const filter = await buildFilter(req.query);
  const rows = await Registration.find(filter).populate('event', POPULATE).sort(SORTS[req.query.sort]);

  const header = ['Code', 'Event', 'Day', 'Name', 'Email', 'Phone', 'Year', 'Department', 'Institution', 'Team', 'Status', 'Registered At'];
  const lines = rows.map((r) =>
    [
      r.code,
      r.event?.title,
      r.event?.day,
      r.name,
      r.email,
      r.phone,
      r.year,
      r.department,
      r.institution,
      r.teamName,
      r.status,
      r.createdAt?.toISOString(),
    ]
      .map(csvCell)
      .join(',')
  );

  const stamp = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="hash27-registrations-${stamp}.csv"`);
  // BOM so Excel opens UTF-8 correctly
  res.send(`\uFEFF${[header.join(','), ...lines].join('\r\n')}\r\n`);
});

export const getOne = asyncHandler(async (req, res) => {
  const reg = await Registration.findById(req.params.id).populate('event', POPULATE);
  if (!reg) throw ApiError.notFound('Registration not found', 'REGISTRATION_NOT_FOUND');
  return ok(res, reg);
});

export const update = asyncHandler(async (req, res) => {
  const reg = await Registration.findById(req.params.id);
  if (!reg) throw ApiError.notFound('Registration not found', 'REGISTRATION_NOT_FOUND');

  const { status, ...rest } = req.body;
  let seatChange = null; // 'reserved' | 'released'

  if (status && status !== reg.status) {
    const wasCancelled = reg.status === 'cancelled';
    const willCancel = status === 'cancelled';
    if (wasCancelled && !willCancel) {
      const event = await Event.findById(reg.event);
      if (!event || !(await reserveSeat(event))) throw ApiError.conflict('This event is full', 'EVENT_FULL');
      seatChange = 'reserved';
    } else if (!wasCancelled && willCancel) {
      await releaseSeat(reg.event);
      seatChange = 'released';
    }
    reg.status = status;
  }

  reg.set(rest);
  try {
    await reg.save();
  } catch (err) {
    if (seatChange === 'reserved') await releaseSeat(reg.event);
    if (seatChange === 'released') await Event.updateOne({ _id: reg.event }, { $inc: { registeredCount: 1 } });
    throw err;
  }
  await reg.populate('event', POPULATE);
  return ok(res, reg);
});

export const remove = asyncHandler(async (req, res) => {
  const reg = await Registration.findById(req.params.id);
  if (!reg) throw ApiError.notFound('Registration not found', 'REGISTRATION_NOT_FOUND');
  if (reg.status !== 'cancelled') await releaseSeat(reg.event);
  await reg.deleteOne();
  return ok(res, { deleted: true });
});
