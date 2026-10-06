import { ApiError } from '../utils/ApiError.js';

/**
 * validate({ body, query, params }) - each value is a zod schema.
 * Parsed (coerced / trimmed / stripped) values replace the originals.
 */
export const validate = (schemas) => (req, _res, next) => {
  const issues = [];
  for (const part of ['params', 'query', 'body']) {
    const schema = schemas[part];
    if (!schema) continue;
    const result = schema.safeParse(req[part] ?? {});
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({ in: part, field: issue.path.join('.') || undefined, message: issue.message });
      }
    } else {
      req[part] = result.data;
    }
  }
  if (issues.length) {
    return next(ApiError.badRequest('Validation failed', issues, 'VALIDATION_ERROR'));
  }
  next();
};
