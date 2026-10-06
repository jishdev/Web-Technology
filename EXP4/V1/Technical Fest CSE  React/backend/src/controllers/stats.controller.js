import { ContactMessage, Event, Registration, Sponsor, TeamMember } from '../models/index.js';
import { asyncHandler, ok } from '../utils/helpers.js';

export const stats = asyncHandler(async (_req, res) => {
  const active = { status: { $ne: 'cancelled' } };

  const [events, totalRegistrations, cancelled, newMessages, totalMessages, teamCount, sponsorCount, byYearRaw, byDeptRaw, recent] =
    await Promise.all([
      Event.find().sort({ day: 1, sortOrder: 1 }),
      Registration.countDocuments(active),
      Registration.countDocuments({ status: 'cancelled' }),
      ContactMessage.countDocuments({ status: 'new' }),
      ContactMessage.countDocuments(),
      TeamMember.countDocuments({ isActive: true }),
      Sponsor.countDocuments({ isActive: true }),
      Registration.aggregate([{ $match: active }, { $group: { _id: '$year', count: { $sum: 1 } } }]),
      Registration.aggregate([{ $match: active }, { $group: { _id: '$department', count: { $sum: 1 } } }]),
      Registration.find().sort({ createdAt: -1 }).limit(8).populate('event', 'slug title day'),
    ]);

  // Departments are free text ("CSE", "cse ") - merge case-insensitively.
  const dept = new Map();
  for (const { _id, count } of byDeptRaw) {
    const key = String(_id || '').trim().toUpperCase();
    if (key) dept.set(key, (dept.get(key) || 0) + count);
  }
  const topDepartments = [...dept.entries()]
    .map(([department, count]) => ({ department, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return ok(res, {
    totals: {
      registrations: totalRegistrations,
      cancelledRegistrations: cancelled,
      events: events.length,
      messages: totalMessages,
      newMessages,
      teamMembers: teamCount,
      sponsors: sponsorCount,
    },
    byEvent: events.map((e) => ({
      id: e.id,
      slug: e.slug,
      title: e.title,
      day: e.day,
      registered: e.registeredCount,
      capacity: e.capacity,
      seatsLeft: e.seatsLeft,
      isActive: e.isActive,
    })),
    byYear: byYearRaw.map(({ _id, count }) => ({ year: _id, count })).sort((a, b) => a.year.localeCompare(b.year)),
    topDepartments,
    recentRegistrations: recent,
  });
});
