# HASH '27 - Backend API

Express + MongoDB (Mongoose) REST API for the HASH '27 TechFest site (MBCET).
It powers event registration, the contact form, the schedule, team / sponsors / gallery pages and the organiser admin dashboard.

- **Stack:** Node 18+ (ESM), Express 4, Mongoose 8, Zod validation, JWT auth, bcryptjs, Helmet, CORS, rate limiting, Multer uploads
- **Postman:** ready-made collection with 180+ automated assertions in [`postman/`](postman)

## Quick start

```powershell
cd backend
npm install
copy .env.example .env        # macOS/Linux: cp .env.example .env
# edit .env: set MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD
npm run seed                   # loads events, team, sponsors, gallery, settings + creates the admin
npm run dev                    # http://localhost:5000  (auto-restarts on change)
```

Check it is alive: <http://localhost:5000/api/health>

**MongoDB** - use either a local server (`mongodb://127.0.0.1:27017/hash27`) or a free MongoDB Atlas cluster (`mongodb+srv://...`; allow your IP in Atlas Network Access).

**Docker alternative** (Mongo + API in one go): create a `.env` with `JWT_SECRET` and `ADMIN_PASSWORD`, then `docker compose up --build`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start with file watching |
| `npm start` | Start (production) |
| `npm run seed` | Insert missing content + the first admin. Never overwrites existing data, safe to re-run |
| `npm run seed:reset` | Wipe events / registrations / messages / team / sponsors / gallery / settings, then re-seed (admins kept) |
| `npm run admin:create -- <user> <password>` | Create an admin, or reset that admin's password |
| `npm run postman` | Run the Postman collection from the terminal with Newman (API must be running) |

## Environment variables

See [`.env.example`](.env.example). The important ones:

| Variable | Notes |
| --- | --- |
| `MONGODB_URI` | Connection string |
| `JWT_SECRET` | 32+ characters. **Required** when `NODE_ENV=production` (server refuses to start otherwise) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | First admin created by `npm run seed` |
| `CLIENT_ORIGINS` | Comma-separated frontend origins allowed by CORS (default `http://localhost:5173`) |
| `TRUST_PROXY` | Set `1` behind Nginx / Render / Railway so rate limiting sees real client IPs |
| `RATE_LIMIT_DISABLED` | `true` only for load tests |

## Testing with Postman

1. Postman -> **Import** -> select both files in [`postman/`](postman):
   `HASH27.postman_collection.json` and `HASH27.local.postman_environment.json`.
2. Choose the **HASH '27 - Local** environment (top right). Edit `adminPassword` if you changed it.
3. Start the API, then open the collection and press **Run** (Collection Runner) - or send requests one by one starting with **01 Auth -> Login**. Login stores the JWT in `{{token}}`; every admin request uses it automatically.
4. Folders run in order. `03 Events` creates a temporary event that `04 Registrations` uses (capacity 2, so it also tests the "event full" path); `99 Cleanup` deletes it, so the run can be repeated.
5. For the upload requests select `postman/sample.png` if Postman asks for the file (Newman finds it automatically).

Same thing from a terminal: `npm run postman`.

## Response format

```jsonc
// success
{ "success": true, "data": { ... }, "meta": { "page": 1, "limit": 20, "total": 42, "pages": 3 } }

// error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Validation failed",
  "details": [ { "in": "body", "field": "email", "message": "Enter a valid email address" } ] } }
```

Common error codes: `VALIDATION_ERROR` 400, `UNAUTHORIZED` / `INVALID_TOKEN` / `TOKEN_EXPIRED` 401, `REGISTRATION_CLOSED` / `EVENT_CLOSED` 403, `*_NOT_FOUND` 404, `ALREADY_REGISTERED` / `EVENT_FULL` / `DUPLICATE` 409, `RATE_LIMITED` 429.

Admin requests send `Authorization: Bearer <token>`; user-account requests send the separate `Authorization: Bearer <userToken>`. The two token types are not interchangeable (admin tokens are rejected on `/api/users/*`, user tokens on admin-only routes) even though both are JWTs signed with the same `JWT_SECRET`. Admin tokens last 8 hours (`JWT_EXPIRES_IN`); user tokens last 30 days.
`PUT` and `PATCH` behave identically everywhere: both apply a partial update.

## Endpoints

**Public**

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness + DB state |
| GET | `/api/settings` | Event name, day headers, registration open/closed state |
| GET | `/api/events` | Flat list (`?day=`, `?category=`, `?q=`) |
| GET | `/api/events/schedule` | Events grouped by day, plus registration state (Events + Register pages) |
| GET | `/api/events/:idOrSlug` | One event (`hackathon`, `ctf`, ... or Mongo id) |
| POST | `/api/registrations` | Register for an event (rate limited) |
| POST | `/api/contact` | Contact form (rate limited) |
| GET | `/api/team`, `/api/team/grouped` | Team members / grouped by section |
| GET | `/api/sponsors`, `/api/sponsors/grouped` | Sponsors / grouped by tier |
| GET | `/api/gallery` | Gallery photos (`?edition=2025`) |
| GET | `/uploads/<file>` | Uploaded images |

**User accounts** (public signup/login for attendees - separate from the organiser admin login)

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/users/signup` | Create an account, returns a token (rate limited) |
| POST | `/api/users/login` | Get a token (rate limited) |
| GET | `/api/users/me` | Current account |
| PUT | `/api/users/me` | Update name / phone / institution |
| POST | `/api/users/change-password` | Change own password |
| GET | `/api/users/me/registrations` | Registrations made while logged in |

Send the user token on `POST /api/registrations` (`Authorization: Bearer <userToken>`) to link that registration to the account; registering without a token still works and needs no account.

**Admin** (JWT required)

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/login` | Get a token (public, rate limited) |
| GET | `/api/auth/me` | Current admin |
| POST | `/api/auth/change-password` | Change own password |
| PATCH | `/api/settings` | Open/close registration, set deadline (`registrationClosesAt`, ISO datetime with offset, or `null`), day headers |
| POST / PATCH / DELETE | `/api/events`, `/api/events/:id` | Manage events (`capacity` 0 = unlimited). `DELETE ?force=true` also removes its registrations |
| GET | `/api/registrations` | List: `?event=` `?status=` `?year=` `?q=` `?sort=newest\|oldest\|name` `?page=` `?limit=` |
| GET | `/api/registrations/export` | Same filters, downloads CSV (Excel-safe) |
| GET / PATCH / DELETE | `/api/registrations/:id` | View, edit, cancel (`status`), delete |
| GET / PATCH / DELETE | `/api/contact`, `/api/contact/:id` | Inbox: `?status=new\|read\|resolved`, `?q=` |
| POST / PATCH / DELETE | `/api/team[/:id]`, `/api/sponsors[/:id]`, `/api/gallery[/:id]` | Manage content. Add `?includeInactive=true` (`includeUnpublished` for gallery) to GETs to see hidden entries |
| POST / DELETE | `/api/uploads`, `/api/uploads/:filename` | Image upload (form-data field `image`; PNG/JPEG/WebP/GIF, 5 MB) |
| GET | `/api/admin/stats` | Dashboard numbers: totals, per-event seats, by year, top departments, recent registrations |

### Registration payload

```json
{
  "event": "hackathon",
  "name": "Asha Nair",
  "email": "asha@example.com",
  "phone": "9876543210",
  "year": "S5",
  "department": "CSE",
  "institution": "MBCET",
  "teamName": "Optional"
}
```

`event` is a slug or id. `year` is `S1 | S3 | S5 | S7 | PG`. Phone accepts `+91` / spaces and is stored as 10 digits.
One registration per email per event. Cancelled registrations free their seat and the same email can register again.
The response contains a confirmation `code` such as `HASH27-7KQ2XM`.

## Behaviour worth knowing

- **Seats:** each event has `capacity` (0 = unlimited). A seat is claimed with a single conditional update, and cancelling/deleting a registration returns it.
- **Registration window:** controlled by `registrationOpen` and optional `registrationClosesAt` in `/api/settings`. The seed leaves the deadline empty.
- **Seed data** comes from the existing frontend pages. Team photos and sponsor logos point at `/assets/...` (served by the frontend); uploaded images are `/uploads/...` (served by this API).
- **Dates:** the seed uses the dates shown on the Events page (Oct 14-16, 2027). Change them any time with `PATCH /api/settings` (`days`).

## Security

Helmet headers, CORS allow-list, request size limit, schema validation on every input (unknown fields are dropped), rejection of `$`/`.` keys (NoSQL operator injection), bcrypt-hashed passwords for both admins and user accounts, constant-time-ish login for unknown users/emails, per-route rate limits (login 10/15 min, registration 20/h, contact 5/h), upload type checked by extension **and** file signature, CSV formula-injection guard, no stack traces in production.

## Project layout

```
src/
  server.js  app.js
  config/        env + database
  models/        Admin, Setting, Event, Registration, ContactMessage, TeamMember, Sponsor, GalleryItem
  validators/    zod schemas
  middleware/    auth, validate, sanitize, rate limits, error handler
  controllers/   request handlers
  routes/        route table
  utils/         helpers, ApiError, seed data
scripts/         seed.js, create-admin.js
postman/         collection, environment, upload fixtures
```

## Deploying

1. Set `NODE_ENV=production`, a strong `JWT_SECRET`, `MONGODB_URI`, `CLIENT_ORIGINS` (your real frontend URL) and `TRUST_PROXY=1` if behind a proxy.
2. `npm ci --omit=dev && npm run seed && npm start` (or use the included `Dockerfile`).
3. Persist the `uploads/` directory (volume / object storage) - it holds admin-uploaded images.
4. Change the seeded admin password: `POST /api/auth/change-password`.
