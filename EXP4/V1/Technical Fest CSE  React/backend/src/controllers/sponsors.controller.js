import { Sponsor, SPONSOR_TIERS } from '../models/index.js';
import { asyncHandler, ok } from '../utils/helpers.js';
import { makeCrud } from './crud.js';

const crud = makeCrud(Sponsor, {
  label: 'Sponsor',
  sort: { order: 1, createdAt: 1 },
  activeField: 'isActive',
  includeParam: 'includeInactive',
  filterFromQuery: (q) => (q.tier ? { tier: q.tier } : {}),
});

export const { list, getOne, create, update, remove } = crud;

// Tiers in display order, empty tiers omitted. Used by the Sponsors page.
export const grouped = asyncHandler(async (req, res) => {
  const sponsors = await crud.findAll(req);
  const tiers = SPONSOR_TIERS.map((t) => ({ ...t, sponsors: sponsors.filter((s) => s.tier === t.key) })).filter(
    (t) => t.sponsors.length
  );
  return ok(res, tiers, { count: sponsors.length });
});
