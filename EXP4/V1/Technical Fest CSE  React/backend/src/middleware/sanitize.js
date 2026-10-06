import { ApiError } from '../utils/ApiError.js';

// Blocks NoSQL operator injection ({"$gt": ""}) and dotted-path keys before any handler runs.
function hasUnsafeKey(value, depth = 0) {
  if (depth > 10 || value === null || typeof value !== 'object') return false;
  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || key.includes('.')) return true;
    if (hasUnsafeKey(value[key], depth + 1)) return true;
  }
  return false;
}

export function sanitize(req, _res, next) {
  if (hasUnsafeKey(req.body) || hasUnsafeKey(req.query) || hasUnsafeKey(req.params)) {
    return next(ApiError.badRequest('Request contains disallowed characters in field names', undefined, 'UNSAFE_INPUT'));
  }
  next();
}
