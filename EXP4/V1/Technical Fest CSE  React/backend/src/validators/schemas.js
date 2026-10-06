import { z } from 'zod';
import { YEARS, REGISTRATION_STATUSES } from '../models/Registration.js';
import { MESSAGE_STATUSES } from '../models/ContactMessage.js';
import { TEAM_SECTION_KEYS } from '../models/TeamMember.js';
import { SPONSOR_TIER_KEYS } from '../models/Sponsor.js';

/* ---------- friendlier default messages (shown next to form fields) ---------- */
z.config({
  customError: (iss) => {
    if (iss.code === 'invalid_type') {
      return iss.input === undefined ? 'This field is required' : `Expected ${iss.expected}`;
    }
    if (iss.code === 'too_small' && iss.origin === 'string') {
      return iss.minimum === 1 ? 'This field is required' : `Must be at least ${iss.minimum} characters`;
    }
    if (iss.code === 'too_big' && iss.origin === 'string') return `Must be at most ${iss.maximum} characters`;
    return undefined; // fall back to zod's default
  },
});

/* ---------- primitives ---------- */
const str = (min, max) => z.string().trim().min(min).max(max);
const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const email = z
  .string()
  .trim()
  .toLowerCase()
  .max(120)
  .pipe(z.email('Enter a valid email address'));

// Accepts "9876543210", "+91 98765 43210", "098765-43210" -> "9876543210"
const indianPhone = z
  .string()
  .transform((s) => s.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, ''))
  .pipe(z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number starting with 6, 7, 8 or 9'));

// http(s) URL, a root-relative path ("/assets/x.png", "/uploads/x.png"), or "" to clear.
const urlOrPath = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === '' || /^(https?:\/\/|\/(?!\/))/i.test(v), 'Must be an http(s) URL or a path starting with /');

const page = z.coerce.number().int().min(1).default(1);
const limit = z.coerce.number().int().min(1).max(100).default(20);
const boolQuery = z.enum(['true', 'false']).transform((v) => v === 'true');

export const idParams = z.object({ id: objectId });
export const uploadFileParams = z.object({
  filename: z.string().regex(/^[a-f0-9]{32}\.(png|jpg|webp|gif)$/, 'Invalid filename'),
});
export const idOrSlugParams = z.object({ id: str(1, 60) });

/* ---------- user auth ---------- */
const password = z.string().min(8, 'Password must be at least 8 characters').max(100);

export const signupBody = z.object({
  name: str(2, 80),
  email,
  password,
  phone: indianPhone.optional().or(z.literal('')),
  institution: z.string().trim().max(120).optional(),
});

export const userLoginBody = z.object({
  email,
  password: z.string().min(1).max(200),
});

export const updateMeBody = z.object({
  name: str(2, 80),
  phone: indianPhone.optional().or(z.literal('')),
  institution: z.string().trim().max(120).optional(),
}).partial({ phone: true, institution: true });

export const userChangePasswordBody = z
  .object({ currentPassword: z.string().min(1).max(200), newPassword: password })
  .refine((v) => v.currentPassword !== v.newPassword, { path: ['newPassword'], message: 'New password must differ from the current password' });

/* ---------- admin auth ---------- */
export const loginBody = z.object({
  username: str(1, 40).transform((s) => s.toLowerCase()),
  password: z.string().min(1).max(200),
});

export const changePasswordBody = z
  .object({
    currentPassword: z.string().min(1).max(200),
    newPassword: z.string().min(8, 'Password must be at least 8 characters').max(100),
  })
  .refine((v) => v.currentPassword !== v.newPassword, {
    path: ['newPassword'],
    message: 'New password must differ from the current password',
  });

/* ---------- settings ---------- */
export const settingsBody = z
  .object({
    eventName: str(1, 80),
    registrationOpen: z.boolean(),
    registrationClosesAt: z.union([z.iso.datetime({ offset: true }), z.null()]),
    days: z
      .array(
        z.object({
          day: z.number().int().min(1).max(10),
          weekday: z.string().trim().max(20).optional(),
          dateLabel: str(1, 40),
        })
      )
      .max(10),
  })
  .partial();

/* ---------- events ---------- */
const eventBase = z.object({
  slug: str(2, 60)
    .transform((s) => s.toLowerCase())
    .pipe(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens')),
  title: str(2, 150),
  day: z.number().int().min(1).max(10),
  time: str(1, 20),
  sortOrder: z.number().int().min(0).max(1000),
  category: str(1, 60),
  venue: str(1, 80),
  description: z.string().trim().max(1000),
  badgeText: z.string().trim().max(20),
  badgeStyle: z.enum(['live', 'closing']).nullable(),
  isTeamEvent: z.boolean(),
  capacity: z.number().int().min(0).max(100000),
  isActive: z.boolean(),
});

export const eventCreateBody = eventBase.partial({
  sortOrder: true,
  description: true,
  badgeText: true,
  badgeStyle: true,
  isTeamEvent: true,
  capacity: true,
  isActive: true,
});
export const eventUpdateBody = eventBase.partial();

export const eventListQuery = z.object({
  day: z.coerce.number().int().min(1).max(10).optional(),
  category: z.string().trim().max(60).optional(),
  q: z.string().trim().max(100).optional(),
});

export const eventDeleteQuery = z.object({ force: boolQuery.optional() });

/* ---------- registrations ---------- */
export const registrationCreateBody = z.object({
  // event slug (e.g. "hackathon") or Mongo id
  event: str(1, 80),
  name: str(2, 80),
  email,
  phone: indianPhone,
  year: z.enum(YEARS, { error: `Year must be one of ${YEARS.join(', ')}` }),
  department: str(1, 60),
  institution: str(2, 120),
  teamName: z.string().trim().max(60).optional(),
});

export const registrationUpdateBody = z
  .object({
    name: str(2, 80),
    phone: indianPhone,
    year: z.enum(YEARS),
    department: str(1, 60),
    institution: str(2, 120),
    teamName: z.string().trim().max(60),
    status: z.enum(REGISTRATION_STATUSES),
  })
  .partial();

export const registrationListQuery = z.object({
  event: z.string().trim().max(80).optional(),
  status: z.enum(REGISTRATION_STATUSES).optional(),
  year: z.enum(YEARS).optional(),
  q: z.string().trim().max(100).optional(),
  sort: z.enum(['newest', 'oldest', 'name']).default('newest'),
  page,
  limit,
});

export const registrationExportQuery = registrationListQuery.omit({ page: true, limit: true });

/* ---------- contact ---------- */
export const contactCreateBody = z.object({
  name: str(2, 80),
  email,
  subject: str(3, 150),
  message: str(10, 2000),
});
export const contactUpdateBody = z.object({ status: z.enum(MESSAGE_STATUSES) });
export const contactListQuery = z.object({
  status: z.enum(MESSAGE_STATUSES).optional(),
  q: z.string().trim().max(100).optional(),
  page,
  limit,
});

/* ---------- team / sponsors / gallery ---------- */
const teamBase = z.object({
  name: str(2, 80),
  role: str(2, 80),
  department: z.string().trim().max(80),
  section: z.enum(TEAM_SECTION_KEYS, { error: `Section must be one of ${TEAM_SECTION_KEYS.join(', ')}` }),
  order: z.number().int().min(0).max(1000),
  photoUrl: urlOrPath,
  isActive: z.boolean(),
});
export const teamCreateBody = teamBase.partial({ department: true, order: true, photoUrl: true, isActive: true });
export const teamUpdateBody = teamBase.partial();
export const teamListQuery = z.object({
  section: z.enum(TEAM_SECTION_KEYS).optional(),
  includeInactive: boolQuery.optional(),
});

const sponsorBase = z.object({
  name: str(2, 100),
  tagline: z.string().trim().max(160),
  tier: z.enum(SPONSOR_TIER_KEYS, { error: `Tier must be one of ${SPONSOR_TIER_KEYS.join(', ')}` }),
  logoUrl: urlOrPath,
  websiteUrl: urlOrPath,
  order: z.number().int().min(0).max(1000),
  isActive: z.boolean(),
});
export const sponsorCreateBody = sponsorBase.partial({
  tagline: true,
  logoUrl: true,
  websiteUrl: true,
  order: true,
  isActive: true,
});
export const sponsorUpdateBody = sponsorBase.partial();
export const sponsorListQuery = z.object({
  tier: z.enum(SPONSOR_TIER_KEYS).optional(),
  includeInactive: boolQuery.optional(),
});

const galleryBase = z.object({
  label: str(1, 80),
  alt: z.string().trim().max(160),
  imageUrl: urlOrPath.refine((v) => v !== '', 'imageUrl is required'),
  edition: str(1, 10),
  order: z.number().int().min(0).max(1000),
  isPublished: z.boolean(),
});
export const galleryCreateBody = galleryBase.partial({ alt: true, edition: true, order: true, isPublished: true });
export const galleryUpdateBody = galleryBase.partial();
export const galleryListQuery = z.object({
  edition: z.string().trim().max(10).optional(),
  includeUnpublished: boolQuery.optional(),
});
