# TECHFEST 2027 — React

React/Vite re-enactment and redesign of the original HASH '27 TechFest site.

## Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Routes

- `/` — home
- `/events` — interactive day-by-day programme
- `/register` — validated registration flow backed by localStorage
- `/gallery` — responsive archive grid + keyboard lightbox/slideshow
- `/team` — organising crew
- `/sponsors` — sponsor tiers
- `/contact` — contact form
- `/admin` — local organiser console

### Demo admin

Username: `ADMINMBCET`  
Password: `Admin#TechFest2027`

The registration, contact, and organiser admin flows use the included Express/MongoDB backend. Configure `VITE_API_URL` when the API is not running at `http://localhost:5000/api`.

The organiser credentials are **not stored in the frontend**. They are configured through the backend `.env` file. See the backend README for setup and Postman instructions.

## Design direction

The redesign uses a graphite / signal-lime visual system, asymmetrical editorial layouts, a bento home composition, a floating navigation pill, restrained motion, CSS-built orbital artwork, responsive states and accessible focus treatment. The original content, event programme, registration fields, team, sponsor tiers and archive assets are retained where useful, but the implementation is component/state driven rather than a collection of HTML pages plus global DOM mutation.
