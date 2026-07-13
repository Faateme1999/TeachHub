# TeachHub

A small learning platform. Users register, log in, create courses and lessons,
enroll in courses, and browse other users. Built as a teaching project for
practicing **NestJS** (backend) and **React** (frontend).

- **`backend/`** — NestJS 11 + Prisma 6 + PostgreSQL API
- **`frontend/`** — React 19 + Vite SPA (React Router, TanStack Query, axios)
- **`docs/`** — the feature list and a [junior-developer task list](docs/junior-dev-tasks.md)

---

## Prerequisites

- **Node.js** 18+
- **Docker** (runs the database — you don't install PostgreSQL yourself)
- **npm** (backend) and **pnpm** (frontend)

---

## Setup

Run these once, from the repo root.

### 1. Backend + database

```bash
cd backend
npm install
cp .env.example .env      # defaults already match the Docker database
npm run db:up             # start PostgreSQL in Docker (host port 5433)
npm run prisma:migrate    # create the database tables
npm run db:seed           # add demo users, courses, and lessons (see below)
npm run start:dev         # API on http://localhost:3000
```

### 2. Frontend

In a **second terminal**:

```bash
cd frontend
pnpm install
pnpm dev                  # app on http://localhost:5173
```

Open **http://localhost:5173** in your browser. Keep the backend running — the
frontend proxies `/api/*` calls to it.

---

## Seed users

`npm run db:seed` (in `backend/`) fills the database with demo data so the app
isn't empty. It creates three accounts — **all share the same password:**

| Name | Email | Password |
|------|-------|----------|
| Ada Lovelace | `ada@teachhub.dev` | `password123` |
| Alan Turing | `alan@teachhub.dev` | `password123` |
| Grace Hopper | `grace@teachhub.dev` | `password123` |

It also creates two demo courses ("Intro to NestJS", "React for Beginners") with
lessons, and enrolls Ada in the NestJS course so her **My Learning** page has
content.

Log in with any of the above, or click **Sign up** to make your own account
(you'll be logged in automatically after registering).

The seed script (`backend/prisma/seed.ts`) is safe to run more than once: it
won't duplicate users or courses.

---

## Everyday commands

**Backend** (`cd backend`):

```bash
npm run start:dev      # dev server (auto-restart)
npm run db:up          # start the database (Docker)
npm run db:down        # stop the database
npm run db:reset       # stop the database and DELETE all its data
npm run db:seed        # re-add the demo data
npm run prisma:migrate # apply schema changes
npm run prisma:studio  # visual database browser
```

**Frontend** (`cd frontend`):

```bash
pnpm dev       # dev server
pnpm build     # type-check + production build
pnpm lint      # oxlint
```

---

## Where to go next

Some backend features are intentionally left as small, guided exercises
(marked `TODO(junior)` in the code). Work through them in
**[docs/junior-dev-tasks.md](docs/junior-dev-tasks.md)**.

For more detail, see the per-project READMEs:
[backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md).
