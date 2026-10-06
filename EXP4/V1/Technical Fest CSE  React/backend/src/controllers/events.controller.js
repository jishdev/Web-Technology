import { Event, Registration, Setting } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler, created, escapeRegex, isObjectId, ok } from '../utils/helpers.js';

const SORT = { day: 1, sortOrder: 1, createdAt: 1 };

export const findEventByIdOrSlug = (key) =>
  isObjectId(key) ? Event.findById(key) : Event.findOne({ slug: String(key).toLowerCase() });

export const list = asyncHandler(async (req, res) => {
  const { day, category, q } = req.query;
  const filter = {};
  if (day) filter.day = day;
  if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
  if (q) filter.title = new RegExp(escapeRegex(q), 'i');
  const events = await Event.find(filter).sort(SORT);
  return ok(res, events, { count: events.length });
});

// Grouped by day, with the day headers from site settings. Used by Events + Register pages.
export const schedule = asyncHandler(async (_req, res) => {
  const [events, site] = await Promise.all([Event.find().sort(SORT), Setting.getSite()]);
  const meta = new Map(site.days.map((d) => [d.day, d]));
  const dayNumbers = [...new Set([...meta.keys(), ...events.map((e) => e.day)])].sort((a, b) => a - b);

  const days = dayNumbers.map((day) => ({
    day,
    weekday: meta.get(day)?.weekday ?? null,
    dateLabel: meta.get(day)?.dateLabel ?? null,
    events: events.filter((e) => e.day === day),
  }));

  return ok(res, {
    eventName: site.eventName,
    registration: { open: site.isRegistrationOpen(), closesAt: site.registrationClosesAt },
    days,
  });
});

export const getOne = asyncHandler(async (req, res) => {
  const event = await findEventByIdOrSlug(req.params.id);
  if (!event) throw ApiError.notFound('Event not found', 'EVENT_NOT_FOUND');
  return ok(res, event);
});

export const create = asyncHandler(async (req, res) => {
  const event = await Event.create(req.body);
  return created(res, event);
});

export const update = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw ApiError.notFound('Event not found', 'EVENT_NOT_FOUND');

  const { capacity } = req.body;
  if (capacity !== undefined && capacity > 0 && capacity < event.registeredCount) {
    throw ApiError.conflict(
      `Capacity cannot be lower than current registrations (${event.registeredCount})`,
      'CAPACITY_BELOW_REGISTERED'
    );
  }

  event.set(req.body);
  await event.save();
  return ok(res, event);
});

export const remove = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw ApiError.notFound('Event not found', 'EVENT_NOT_FOUND');

  const regCount = await Registration.countDocuments({ event: event._id });
  if (regCount > 0 && !req.query.force) {
    throw ApiError.conflict(
      `Event has ${regCount} registration(s). Re-send with ?force=true to delete them too.`,
      'EVENT_HAS_REGISTRATIONS'
    );
  }
  if (regCount > 0) await Registration.deleteMany({ event: event._id });
  await event.deleteOne();
  return ok(res, { deleted: true, registrationsDeleted: regCount });
});
