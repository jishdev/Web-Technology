import { ApiError } from '../utils/ApiError.js';
import { asyncHandler, created, ok } from '../utils/helpers.js';

/**
 * Generic CRUD handlers for simple content collections (team, sponsors, gallery).
 * Public reads only see documents where `activeField` is true; an admin token +
 * `?<includeParam>=true` reveals the rest.
 */
export function makeCrud(Model, { label, sort, activeField, includeParam, filterFromQuery = () => ({}) }) {
  const notFound = () => ApiError.notFound(`${label} not found`, `${label.toUpperCase().replace(/\s+/g, '_')}_NOT_FOUND`);
  const seesAll = (req) => Boolean(req.admin) && req.query[includeParam] === true;

  const findAll = async (req) => {
    const filter = filterFromQuery(req.query);
    if (!seesAll(req)) filter[activeField] = true;
    return Model.find(filter).sort(sort);
  };

  return {
    findAll,
    list: asyncHandler(async (req, res) => {
      const items = await findAll(req);
      return ok(res, items, { count: items.length });
    }),
    getOne: asyncHandler(async (req, res) => {
      const doc = await Model.findById(req.params.id);
      if (!doc || (!req.admin && !doc[activeField])) throw notFound();
      return ok(res, doc);
    }),
    create: asyncHandler(async (req, res) => created(res, await Model.create(req.body))),
    update: asyncHandler(async (req, res) => {
      const doc = await Model.findById(req.params.id);
      if (!doc) throw notFound();
      doc.set(req.body);
      await doc.save();
      return ok(res, doc);
    }),
    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw notFound();
      return ok(res, { deleted: true });
    }),
  };
}
