import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler, created, ok } from '../utils/helpers.js';

fs.mkdirSync(env.uploadDir, { recursive: true });

const EXT = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' };

// Magic-byte check: the client-supplied mimetype alone is not trusted.
const SIGNATURES = {
  'image/png': (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/gif': (b) => b.subarray(0, 4).toString('ascii') === 'GIF8',
  'image/webp': (b) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP',
};

const upload = multer({
  storage: multer.diskStorage({
    destination: env.uploadDir,
    filename: (_req, file, cb) => cb(null, `${crypto.randomBytes(16).toString('hex')}${EXT[file.mimetype]}`),
  }),
  limits: { fileSize: env.maxUploadMb * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) =>
    EXT[file.mimetype]
      ? cb(null, true)
      : cb(ApiError.badRequest('Only PNG, JPEG, WebP or GIF images are allowed', undefined, 'UNSUPPORTED_FILE_TYPE')),
});

export const uploadImage = upload.single('image');

export const handleUpload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Attach an image in the "image" form field', undefined, 'NO_FILE');

  const fd = fs.openSync(req.file.path, 'r');
  const head = Buffer.alloc(12);
  fs.readSync(fd, head, 0, 12, 0);
  fs.closeSync(fd);

  if (!SIGNATURES[req.file.mimetype](head)) {
    fs.unlinkSync(req.file.path);
    throw ApiError.badRequest('File content does not match an image type', undefined, 'UNSUPPORTED_FILE_TYPE');
  }

  return created(res, {
    url: `/uploads/${path.basename(req.file.path)}`,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

export const removeUpload = asyncHandler(async (req, res) => {
  // filename is validated against /^[a-f0-9]{32}\.(png|jpg|webp|gif)$/ - no path traversal possible.
  try {
    await fs.promises.unlink(path.join(env.uploadDir, req.params.filename));
  } catch (err) {
    if (err.code === 'ENOENT') throw ApiError.notFound('File not found', 'FILE_NOT_FOUND');
    throw err;
  }
  return ok(res, { deleted: true });
});
