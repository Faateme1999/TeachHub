# TeachHub — Backend (NestJS + Prisma)

The API for TeachHub, a small learning platform where users register, log in,
create courses, add lessons, browse users, and enroll in courses.

Tech: **NestJS 11**, **Prisma 6** (PostgreSQL), **JWT auth** (Passport), **bcrypt**.

> New to the project? After you get it running, open
> [`../docs/junior-dev-tasks.md`](../docs/junior-dev-tasks.md) — it's an ordered,
> beginner-friendly checklist that walks you through finishing the `TODO(junior)`
> items left in the code.

---

## 1. Prerequisites

- Node.js 18+ and npm
- **Docker** (for the database — see below). No need to install PostgreSQL yourself.

## 2. Setup

**Step 1 — install dependencies:**

```bash
npm install
```

**Step 2 — create your `.env`** (Prisma reads `DATABASE_URL` from it). Just copy
the example — the defaults already match the Docker database:

```bash
cp .env.example .env
```

**Step 3 — start the database with Docker.** This runs PostgreSQL in a container
so you don't have to install it. It listens on host port **5433**:

```bash
npm run db:up        # = docker compose up -d
```

> Useful DB commands: `npm run db:down` stops it, `npm run db:reset` stops it and
> **deletes all data**. See `docker-compose.yml` for details.

**Step 4 — create the tables** (and generate the Prisma client):

```bash
npm run prisma:migrate   # = prisma migrate dev
```

## 3. Run

```bash
npm run start:dev      # watch mode, restarts on file changes
```

The API starts on **http://localhost:3000** and prints:
`🚀 TeachHub is running on http://localhost:3000`.

CORS is enabled for the frontend dev server at **http://localhost:5173**.

## 4. Handy commands

```bash
npm run start:dev          # dev server (watch mode)
npm run build              # compile to dist/
npm run start:prod         # run the compiled build
npm run lint               # eslint --fix
npm test                   # unit tests

npm run db:up              # start the Postgres database (Docker)
npm run db:down            # stop the database
npm run db:reset           # stop + delete all database data
npm run prisma:migrate     # create/apply a migration after editing schema.prisma
npm run prisma:studio      # visual database browser (great for beginners)
```

---

## 5. API endpoints

| Method | Endpoint | Auth | What it does |
|--------|----------|------|--------------|
| POST | `/auth/register` | Public | Create an account (name, email, password) |
| POST | `/auth/login` | Public | Log in → returns `accessToken` + `user` |
| GET | `/users` | Public\* | List all users |
| GET | `/users/my-profile` | JWT | The logged-in user's profile |
| GET | `/users/me/courses` | JWT | The logged-in user's enrolled courses |
| GET | `/users/:id` | Public | A user's public profile |
| GET | `/users/:id/courses` | Public | A user's enrolled courses — **stub (501)**, see tasks doc |
| GET | `/courses` | Public | List all courses |
| GET | `/courses/:id` | Public | One course's details |
| POST | `/courses` | JWT | Create a course |
| PATCH | `/courses/:id` | JWT | Update a course |
| DELETE | `/courses/:id` | JWT | Delete a course |
| POST | `/courses/:id/enroll` | JWT | Enroll the logged-in user in a course |
| GET | `/courses/:courseId/lessons` | Public | List a course's lessons |
| POST | `/courses/:courseId/lessons` | JWT | Add a lesson to a course |
| GET | `/lessons/:id` | Public | One lesson's details |
| PATCH | `/lessons/:id` | JWT | Update a lesson |
| DELETE | `/lessons/:id` | JWT | Delete a lesson |

\* Marked as a `TODO(junior)` to require JWT per the features doc.

**Auth:** send `Authorization: Bearer <accessToken>` (from `/auth/login`) on any
JWT route.

---

## 6. Unfinished work (on purpose!)

Some behavior is intentionally left as `TODO(junior)` stubs so you can implement
it as a learning exercise. Search the code for `TODO(junior)` or follow the
step-by-step list in [`../docs/junior-dev-tasks.md`](../docs/junior-dev-tasks.md):

- `GET /users/:id/courses` currently returns **501 Not Implemented**.
- Course detail doesn't include its lessons yet (`include: { lessons: true }`).
- Deleting a course with lessons/enrollments fails (needs cascade or cleanup).
- Missing records return `null`/500 instead of a clean **404**.
- The JWT secret is hardcoded — move it to `.env`.
