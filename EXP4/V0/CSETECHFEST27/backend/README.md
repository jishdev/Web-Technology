# HASH TechFest 2027 Backend

Production-style REST backend for the React frontend.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT admin authentication
- bcryptjs password verification
- Helmet, CORS, rate limiting, Morgan
- REST API designed for Postman testing

## 1. Requirements
- Node.js 18+ (20+ recommended)
- MongoDB Community Server running locally, **or** a MongoDB Atlas connection string
- npm

## 2. Install

```bash
npm install
```

## 3. Configure

Copy `.env.example` to `.env` and set:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hash_techfest_2027
JWT_SECRET=use-a-long-random-secret
ADMIN_USERNAME=ADMINMBCET
ADMIN_PASSWORD=your-real-admin-password
CLIENT_ORIGIN=http://localhost:5173
```

Do **not** commit `.env`.

## 4. Start

Development:

```bash
npm run dev
```

Production-style:

```bash
npm start
```

The API is available at `http://localhost:5000/api`.

Health check:

`GET http://localhost:5000/api/health`

## 5. Frontend

The frontend defaults to:

`VITE_API_URL=http://localhost:5000/api`

If the backend is hosted elsewhere, create `frontend/.env`:

```env
VITE_API_URL=https://your-api-domain.example/api
```

Then restart Vite.

## 6. Postman

Import:

`postman/HASH-TechFest-2027.postman_collection.json`

The collection contains:
- Health check
- Admin login
- Create/list/update/delete registrations
- Dashboard
- CSV export
- Contact submission/listing
- Task CRUD
- Audit log clearing

Run **Admin Login** first. Its test script automatically stores the JWT in the collection variable `token`. The registration and task tests also store their created IDs.

### Default demo credentials
Use the values you put in `.env`.

Username:
`ADMINMBCET`

Password:
the value of `ADMIN_PASSWORD`

## API summary

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Health/database status |
| POST | `/api/auth/login` | No | Admin JWT login |
| POST | `/api/registrations` | No | Public registration |
| GET | `/api/registrations` | Admin | List/search registrations |
| PATCH | `/api/registrations/:id` | Admin | Edit registration |
| DELETE | `/api/registrations/:id` | Admin | Delete registration |
| DELETE | `/api/registrations` | Admin | Delete all registrations |
| GET | `/api/registrations/export` | Admin | CSV export |
| POST | `/api/contacts` | No | Submit contact message |
| GET | `/api/contacts` | Admin | List messages |
| PATCH | `/api/contacts/:id` | Admin | Update message status |
| GET | `/api/tasks` | Admin | List tasks |
| POST | `/api/tasks` | Admin | Create task |
| PATCH | `/api/tasks/:id` | Admin | Update task |
| DELETE | `/api/tasks/:id` | Admin | Delete task |
| GET | `/api/admin/dashboard` | Admin | Dashboard data |
| DELETE | `/api/admin/audit` | Admin | Clear login audit log |

## Notes

Registration duplicates are prevented per email + event. Authentication attempts are logged in MongoDB. The frontend no longer relies on `localStorage` for registrations, tasks, or admin credentials.
