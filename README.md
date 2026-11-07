# 🌱 AL-HASAD GATE

**A smart-agriculture platform that connects farmers with specialist agronomists.**

Farmers browse a guide of crops (ideal conditions and every growth stage), and when something goes wrong they submit a consultation request with photos. The request is assigned to an agronomist who specialises in that crop's category, who answers it inside the platform. Every step is tracked, and farmers can review the advice they received.

---

## Table of contents
- [The problem](#the-problem)
- [User roles](#user-roles)
- [Main features](#main-features)
- [Consultation workflow](#consultation-workflow)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Database](#database)
- [Getting started](#getting-started)
- [Test accounts](#test-accounts)
- [API overview](#api-overview)
- [Security](#security)
- [Coming soon: hardware integration](#coming-soon-hardware-integration)
- [Deployment](#deployment)

---

## The problem
Small farmers often lose part of a harvest to problems that are easy to fix when caught early: wrong irrigation, a fungal disease, the wrong temperature for a growth stage. Expert advice is hard to reach and slow to arrive.

AL-HASAD GATE gives farmers:
- reliable crop information in one place, and
- a direct, tracked channel to agronomists who specialise in their crops.

## User roles

| Role | Who | What they can do |
|---|---|---|
| **User** (Farmer) | Registers publicly | Browse the crop guide, submit consultation requests with photos, track their status and history, edit or cancel while pending, close answered requests, write and manage reviews, manage profile and password |
| **Agronomist** (third role) | Created by an admin | Own dashboard and statistics, see **only requests assigned to them**, start work, send answers or reject with a reason, moderate reviews for crops in their specialties and their own consultations. No access to user, crop or category management |
| **Admin** | Created with `npm run create:admin` or by another admin | Full control: dashboard and analytics, manage users (create, edit, change role and specialties, activate/deactivate, delete), categories, crops and growth stages, assign/reassign/reject/close requests, moderate all feedback, contact messages and the activity log |

All permissions are enforced on the backend (role + ownership checks), not only by hiding buttons.

## Main features
- **Crop guide**: search, category filters, sorting and pagination; a details page per crop with requirements, growth stages and approved reviews
- **Consultation requests** with up to 3 photos, status history and role-based actions
- **Specialist matching**: admins can only assign a request to active agronomists specialised in the crop's category, sorted by current workload
- **Feedback & reviews**: pending by default, approved by an admin or a specialist agronomist, only approved reviews are public
- **Dashboards with live data** for each role (no hard-coded numbers)
- **Admin management** tables with server-side search, filtering, sorting and pagination
- **Activity log** of important actions
- **Contact form** that stores messages for the admin
- **Smart Farming** explainer page, light/dark theme, responsive on mobile, tablet and desktop

## Consultation workflow

```
pending ──(admin assigns)──▶ assigned ──(agronomist starts)──▶ in_progress ──(agronomist answers)──▶ answered ──(farmer/admin closes)──▶ closed
   │                            │                                  │
   ├──(farmer cancels)──▶ cancelled                                │
   └──(admin rejects)───▶ rejected ◀──(admin / assigned agronomist rejects with a reason)
```

1. The farmer submits a request (stored as **pending**) with optional photos.
2. The admin assigns it to an eligible specialist (**assigned**).
3. The agronomist starts working (**in_progress**) and sends an answer (**answered**).
4. The farmer reads the answer, closes the request (**closed**) and can leave a review.
5. Every transition is validated (role, ownership, current status), runs inside a **database transaction with a row lock**, and is written to `request_status_history` and `activity_logs`. Dashboards update automatically.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, React Router (nested routes + `Outlet` layouts), **Material UI**, Axios (interceptors for token refresh), Context API, React Hook Form, react-hot-toast, Vite |
| Backend | Node.js, Express 5, MVC, JWT (access + refresh), bcrypt, Joi, Multer, Helmet, express-rate-limit, Nodemailer |
| Database | PostgreSQL (pgAdmin), node-pg-migrate migrations, seed scripts, parameterized SQL with `pg` |
| Tools | Git & GitHub, Postman, environment variables |

## Project structure

```
final-project-full-stack/
├── client/                     React app
│   └── src/
│       ├── api/                one file per resource (axios calls)
│       ├── Components/         reusable UI (Common, Form, Layouts, Requests, Crops, Admin, ...)
│       ├── Context/            AuthContext, ThemeContext, theme
│       ├── Hooks/              useAuth, useFetch, useTableQuery, useAsyncAction, ...
│       ├── Pages/              pages per area (User, Agronomist, Admin, public pages)
│       ├── Routes/             public / user / agronomist / admin routes, ProtectedRoute, GuestRoute
│       └── utils/              errors, formatting, roles, crop images
└── server/                     Express API
    ├── migrations/             database schema (node-pg-migrate)
    ├── seeds/                  test data
    ├── uploads/                uploaded request photos (git-ignored)
    └── src/
        ├── config/             database connection
        ├── controller/         request handlers
        ├── middleware/         authenticate, authorize, validate, upload, csrf, rate limits, errors
        ├── model/              SQL queries
        ├── routes/             REST endpoints
        ├── utils/              tokens, cookies, email, pagination, workflow rules
        └── validation/         Joi schemas
```

## Database

Main tables and relationships:

| Table | Purpose | Relationships |
|---|---|---|
| `users` | Farmers, agronomists, admins | role check, unique email |
| `categories` | Crop categories | 1 ─ * `crops` |
| `crops` | Crop guide entries | * ─ 1 `categories`, 1 ─ * `crop_growth_stages` |
| `crop_growth_stages` | Ordered stages per crop | * ─ 1 `crops` |
| `agronomist_specialties` | **Many-to-many** agronomists ↔ categories | composite primary key |
| `consultation_requests` | The main workflow | * ─ 1 farmer, * ─ 1 crop, * ─ 1 agronomist |
| `request_status_history` | Every status change | * ─ 1 request |
| `request_attachments` | Uploaded photos (file reference only) | * ─ 1 request |
| `feedback` | Reviews with moderation status | * ─ 1 user, crop, request (one review per request) |
| `email_verification_tokens`, `refresh_token_sessions` | Auth tokens (stored as SHA-256 hashes) | * ─ 1 user |
| `activity_logs`, `contact_messages` | Audit trail and contact form | |

Constraints back up the business rules at the database level (for example: a rejected request must have a reason, an answered request must have a response, ratings are between 1 and 5, a user cannot review their own feedback). Frequently filtered columns are indexed, and lists use database-level pagination.

The first migration is a **baseline** of the original pgAdmin schema (`IF NOT EXISTS`), so the same migrations work on the existing local database and recreate everything on a new one.

## Getting started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+

### 1. Clone
```bash
git clone https://github.com/Shokri2/final-project-full-stack.git
cd final-project-full-stack
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env
```
Edit `server/.env`:

| Variable | Description |
|---|---|
| `PORT` | API port (default `3000`) |
| `NODE_ENV` | `development` locally, `production` when deployed |
| `CLIENT_URL` | Frontend origin(s), comma-separated, used for CORS and email links |
| `DB_URL` / `DATABASE_URL` | PostgreSQL connection string (app / migrations) |
| `ACCESS_JWT_SECRET`, `REFRESH_JWT_SECRET` | Long random strings |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | Email for verification links. If empty, the link is printed in the server console |
| `SEED_PASSWORD` | Password for all seeded test accounts |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used by `npm run create:admin` |

Create the database, then run:
```bash
npm run migrate:up
npm run db:seed
npm run dev
```
The API runs on `http://localhost:3000` (health check: `/health`).

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
The app runs on `http://localhost:5173`. `VITE_API_URL` points to the API (default `http://localhost:3000/api`).

### Useful scripts (server)
| Script | What it does |
|---|---|
| `npm run dev` | Start the API with nodemon |
| `npm run migrate:up` / `migrate:down` | Apply / roll back migrations |
| `npm run db:seed` | Insert test data (safe to run again, never deletes data) |
| `npm run create:admin` | Create or update an admin from the `ADMIN_*` variables |

## Test accounts
After `npm run db:seed`, all accounts use the password from `SEED_PASSWORD` in `server/.env.example`.

| Role | Email | Notes |
|---|---|---|
| Admin | `admin@alhasad.test` | Full access |
| Agronomist | `lina.agronomist@alhasad.test` | Fruiting vegetables, fruits |
| Agronomist | `omar.agronomist@alhasad.test` | Leafy greens, root & bulb crops |
| Farmer | `ahmad.farmer@alhasad.test` | Has requests in several statuses |
| Farmer | `sara.farmer@alhasad.test`, `yousef.farmer@alhasad.test` | |
| Farmer | `nour.unverified@alhasad.test` | Email not verified → redirected to verification |
| Farmer | `khaled.inactive@alhasad.test` | Deactivated → cannot log in |

## API overview
Base URL: `/api`. All list endpoints accept `page`, `limit`, `search`, `sort` and `order`.

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `/auth/verify-email`, `/auth/resend-verification`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me` |
| Users | `GET /users/Users`, `POST /users/createUser`, `GET /users/getUser/:id`, `PUT /users/updateUser/:id`, `PUT /users/changePassword`, `PATCH /users/updateStatus/:id/status`, `PATCH /users/updateRole/:id/role`, `PUT /users/updateSpecialties/:id`, `DELETE /users/deleteUser/:id` |
| Catalog | `GET /categories`, `GET/POST/PUT/DELETE /category/:id`, `GET /crops`, `GET /crops/:id`, `GET /crops/manage`, `POST/PUT/DELETE /crops/:id`, `PATCH /crops/:id/status` |
| Requests | `GET/POST /requests`, `GET/PUT /requests/:id`, `PATCH /requests/:id/{assign,start,answer,reject,cancel,close}`, `GET /requests/:id/eligible-agronomists`, `POST /requests/:id/attachments`, `DELETE /requests/:id/attachments/:attachmentId` |
| Feedback | `GET /feedback/public`, `GET /feedback/mine`, `GET/POST /feedback`, `GET/PUT/DELETE /feedback/:id`, `PATCH /feedback/:id/{approve,reject}` |
| Other | `GET /dashboard/{admin,agronomist,user}`, `GET /activities`, `POST /contact`, `GET/PATCH/DELETE /contact/:id` |

## Security
- Passwords hashed with **bcrypt**; never returned by the API
- **Access token** (15 min) in the `Authorization` header; **refresh token** (7 days) in an **httpOnly** cookie, rotated on every refresh and stored only as a hash
- Automatic token renewal in the Axios interceptor; expired sessions log out with a message
- **CSRF protection** on cookie endpoints (custom header + origin check)
- **Email verification** required before login; public registration always creates a farmer
- Role checks and ownership checks on every protected endpoint; IDs in URLs cannot expose another user's data
- **Joi** validation on the server and **React Hook Form** validation on the client
- **Helmet**, CORS restricted to `CLIENT_URL`, rate limits on login and sensitive endpoints
- Parameterized SQL everywhere; database errors mapped to safe HTTP responses by a central error handler
- Uploads: JPG/PNG/WEBP only, 5 MB and 3 files max, unique names, file-signature check, references stored in PostgreSQL
- Secrets live in `.env` files, which are git-ignored

## Coming soon: hardware integration
Some public pages describe smart irrigation, field sensors and an agricultural robot. These are the **next phase** of the project: connecting a real robot and sensors to feed live soil, climate and irrigation data into the platform. They are not part of the current release.

## Deployment
Deployment URLs will be added here:

- Frontend: _coming soon_
- Backend API: _coming soon_
- Database: _coming soon_
