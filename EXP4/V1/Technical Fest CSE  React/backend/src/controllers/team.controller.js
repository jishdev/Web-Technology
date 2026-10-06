import { TeamMember, TEAM_SECTIONS } from '../models/index.js';
import { asyncHandler, ok } from '../utils/helpers.js';
import { makeCrud } from './crud.js';

const crud = makeCrud(TeamMember, {
  label: 'Team member',
  sort: { order: 1, createdAt: 1 },
  activeField: 'isActive',
  includeParam: 'includeInactive',
  filterFromQuery: (q) => (q.section ? { section: q.section } : {}),
});

export const { list, getOne, create, update, remove } = crud;

// Sections in display order, empty sections omitted. Used by the Team page.
export const grouped = asyncHandler(async (req, res) => {
  const members = await crud.findAll(req);
  const sections = TEAM_SECTIONS.map((s) => ({ ...s, members: members.filter((m) => m.section === s.key) })).filter(
    (s) => s.members.length
  );
  return ok(res, sections, { count: members.length });
});
