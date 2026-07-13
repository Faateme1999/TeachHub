# TeachHub — Backend (NestJS + Prisma)

The API for TeachHub, a small learning platform with two roles — **students**
(self sign-up, browse + enroll) and **admins** (manage courses/lessons, create
other admins).

Tech: **NestJS 11**, **Prisma 6** (PostgreSQL), **JWT auth** (Passport), **bcrypt**,
role-based access control (a `RolesGuard` + `@Roles` decorator).

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

Auth levels: **Public** · **JWT** (any logged-in user) · **JWT + ADMIN** (admin only).

| Method | Endpoint | Auth | What it does |
|--------|----------|------|--------------|
| POST | `/auth/register` | Public | Create an account — **always a STUDENT** (name, email, password) |
| POST | `/auth/login` | Public | Log in → returns `accessToken` + `user` (incl. `role`) |
| POST | `/auth/admins` | JWT + ADMIN | Create another admin — **createAdmin is a stub (501)**, see tasks doc |
| GET | `/users` | Public\* | List all users |
| GET | `/users/my-profile` | JWT | The logged-in user's profile |
| GET | `/users/me/courses` | JWT | The logged-in user's enrolled courses |
| GET | `/users/:id` | Public | A user's public profile |
| GET | `/users/:id/courses` | Public | A user's enrolled courses — **stub (501)**, see tasks doc |
| GET | `/courses` | Public | List all courses |
| GET | `/courses/:id` | Public | One course's details |
| POST | `/courses` | JWT + ADMIN | Create a course |
| PATCH | `/courses/:id` | JWT + ADMIN | Update a course |
| DELETE | `/courses/:id` | JWT + ADMIN | Delete a course |
| POST | `/courses/:id/enroll` | JWT | Enroll the logged-in user in a course (student action) |
| GET | `/courses/:courseId/lessons` | Public | List a course's lessons |
| POST | `/courses/:courseId/lessons` | JWT + ADMIN | Add a lesson to a course |
| GET | `/lessons/:id` | Public | One lesson's details |
| PATCH | `/lessons/:id` | JWT + ADMIN | Update a lesson |
| DELETE | `/lessons/:id` | JWT + ADMIN | Delete a lesson |

\* Marked as a `TODO(junior)` to tighten to `JWT + ADMIN` per the features doc.

**Auth:** send `Authorization: Bearer <accessToken>` (from `/auth/login`) on any
JWT route. Admin routes additionally require the user's role to be `ADMIN`,
enforced by `RolesGuard` + the `@Roles(Role.ADMIN)` decorator. **Note:** the
`RolesGuard` decision logic is a `TODO(junior)` stub — until it's implemented the
admin routes deny everyone. See the tasks doc.

---

## 6. Unfinished work (on purpose!)

Some behavior is intentionally left as `TODO(junior)` stubs so you can implement
it as a learning exercise. Search the code for `TODO(junior)` or follow the
step-by-step list in [`../docs/junior-dev-tasks.md`](../docs/junior-dev-tasks.md):

- **`RolesGuard` is a stub** (`src/auth/guards/roles.guard.ts`) — the admin role
  check isn't written yet, so admin routes currently deny everyone (Task 1.8).
- **`createAdmin` is a stub** (`src/auth/auth.service.ts`) — `POST /auth/admins`
  returns 501 until you implement it (Task 1.9).
- `GET /users/:id/courses` currently returns **501 Not Implemented**.
- Course detail doesn't include its lessons yet (`include: { lessons: true }`).
- Deleting a course with lessons/enrollments fails (needs cascade or cleanup).
- Missing records return `null`/500 instead of a clean **404**.
- The JWT secret is hardcoded — move it to `.env`.

> **Heads up — roles need a migration + seed.** After pulling these changes run
> `npx prisma migrate dev --name add_user_role` then `npm run db:seed` so the
> `role` column exists and the seed admin (`admin@teachhub.dev`) is created.
