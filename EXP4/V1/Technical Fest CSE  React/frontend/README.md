# HASH '27 - Frontend

React 19 + Vite single-page site for the HASH '27 TechFest (MBCET), backed by the Express/MongoDB API in `../backend`.

## Quick start

```bash
npm install
cp .env.example .env     # defaults are fine for local dev
npm run dev               # http://localhost:5173
```

The dev server proxies `/api` and `/uploads` to `http://localhost:5000` (see `vite.config.js`), so **start the backend first** (`cd ../backend && npm run seed && npm run dev`). With the proxy, `VITE_API_URL` stays empty and there's nothing else to configure for local development.

## Building

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally (also proxied)
```

For a real deployment, set `VITE_API_URL` in `.env` to the backend's public URL before building (no trailing slash), e.g. `VITE_API_URL=https://api.yourdomain.com`.

## What's wired to the API

| Page | Behaviour |
| --- | --- |
| Events | Schedule loaded from `GET /api/events/schedule`, grouped by day |
| Register | Event dropdown from the live schedule; submits to `POST /api/registrations`; shows the confirmation code; disabled/marked full when an event or the whole window is closed |
| Contact | Submits to `POST /api/contact` |
| Team / Sponsors | Loaded from `/api/team/grouped` and `/api/sponsors/grouped` |
| Gallery | Loaded from `/api/gallery` |
| Account (`/account`) | Public signup/login (`/api/users/*`), profile editing, and a "My Registrations" list. Logging in pre-fills the Register form and links new registrations to the account |
| Admin (`/admin`) | Separate organiser login (`/api/auth/login`); dashboard with stats, per-event capacity/registration toggles, a searchable/filterable registrations table with CSV export, a contact-message inbox, and the registration-open/deadline switch |

Two independent auth systems, each its own JWT stored in `localStorage` under a different key: the public `/account` login (`hash27_user_token`) and the organiser `/admin` login (`hash27_admin_token`). See `src/api/client.js`.

Photos/logos that haven't been uploaded yet (most of the seeded content) show a neat initials placeholder instead of a broken image (`src/components/SafeImage.jsx`).

## Project layout

```
src/
  api/          client.js (fetch wrapper), format.js (date helpers)
  context/      AccountContext (public user session)
  hooks/        useApi (fetch-on-mount with abort + reload)
  components/   SiteShell, Navbar, Footer, SafeImage, Status
  pages/        Home, Events, Register, Contact, Team, Sponsors, Gallery, Account, Admin, NotFound
  pages/admin/  Dashboard, Overview, Registrations, Messages, SettingsPanel
  stylesheets/  style.css (site theme), api-ui.css (small additions)
public/assets/  images + background video served as static files (/assets/...)
```

## Notes

- Routing is a small custom SPA router in `App.jsx` (no react-router dependency) that intercepts same-origin `<a href>` clicks.
- `src/stylesheets/style.css` is a full theme written for this build - the original upload only had Vite's template CSS with no site styles.
