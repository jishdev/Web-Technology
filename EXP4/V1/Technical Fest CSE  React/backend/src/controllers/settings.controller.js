import { Setting } from '../models/index.js';
import { asyncHandler, ok } from '../utils/helpers.js';

const present = (site) => ({ ...site.toJSON(), registrationCurrentlyOpen: site.isRegistrationOpen() });

export const getSettings = asyncHandler(async (_req, res) => ok(res, present(await Setting.getSite())));

export const updateSettings = asyncHandler(async (req, res) => {
  const site = await Setting.getSite();
  const body = { ...req.body };
  if (body.registrationClosesAt) body.registrationClosesAt = new Date(body.registrationClosesAt);
  site.set(body);
  await site.save();
  return ok(res, present(site));
});
