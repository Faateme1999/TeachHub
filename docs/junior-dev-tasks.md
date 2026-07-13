# TeachHub — Junior Developer Task List

Welcome! 👋 The app is **complete and runnable today**, but a few backend pieces
were left as small, well-marked exercises for you to finish. This is your ordered,
step-by-step checklist.

**How to use this list**
- Work top to bottom. Each task says **what**, **where** (a file link), **why**,
  a **hint** (a little code to try — not the whole answer), and **how to verify**.
- In the code, search for `TODO(junior)` to jump straight to the spot.
- Check items off (`[x]`) as you finish them.
- After each backend change, restart or let the dev server reload, and test with
  the app or `curl`.

Related reading: the feature list in [features.md](./features.md) and the coverage
report in [features-api-comparison.md](./features-api-comparison.md).

---

## Section 0 — Get everything running

- [ ] **Set up the backend.** You need **Docker** installed (it runs the database
      for you — no installing Postgres by hand).
  1. `cd backend && npm install`
  2. `cp .env.example .env`  (the defaults already point at the Docker database)
  3. `npm run db:up`  (starts PostgreSQL in Docker on port 5433)
  4. `npm run prisma:migrate`  (creates the tables)
  5. `npm run start:dev`  → API runs on **http://localhost:3000**

- [ ] **Set up the frontend.**
  1. `cd frontend && pnpm install`
  2. `pnpm dev`  → app runs on **http://localhost:5173**

- [ ] **Confirm they talk to each other.** Open the app, register an account,
      and create a course. If the course appears, the frontend → proxy → backend
      → database path is working end to end.

> **How do they connect?** The frontend calls URLs like `/api/courses`. The Vite
> dev server (see `frontend/vite.config.ts`) forwards `/api/...` to the backend on
> port 3000. That's why you don't hit CORS errors during development.

---

## Section 1 — Backend tasks (finish the stubs)

These are the intentionally-unfinished pieces. Do them in order — each one is
small.

### Task 1.1 — Implement "a user's enrolled courses" (US-028)

- [ ] **What:** Make `GET /users/:id/courses` return the courses that user is
      enrolled in. Right now it returns **501 Not Implemented**.
- **Where:** [`../backend/src/users/users.service.ts`](../backend/src/users/users.service.ts)
  → `findCoursesByUserId()`.
- **Why:** The user-profile page in the app shows "🚧 Coming soon" because this
  endpoint isn't done. Finishing it makes that section light up automatically.
- **Concept:** A *service method* holds the logic; the *controller* just calls it.
  The logic you need **already exists** as `enrollmentsService.findUserCourses()`
  — you're just wiring it up.
- **Hint:** In `findCoursesByUserId`, delete the `throw new NotImplementedException(...)`
  line and return the enrollment lookup instead:
  ```ts
  async findCoursesByUserId(userId: number) {
    return this.enrollmentsService.findUserCourses(userId)
  }
  ```
- **Verify:** `curl http://localhost:3000/users/1/courses` returns a JSON array of
  courses (or `[]`), **not** a 501 error. In the app, open a user's profile — the
  "Enrolled courses" section should now show real data.

### Task 1.2 — Include lessons in the course detail (US-016)

- [ ] **What:** Make `GET /courses/:id` also return that course's lessons.
- **Where:** [`../backend/src/courses/courses.service.ts`](../backend/src/courses/courses.service.ts)
  → `findById()`.
- **Why:** Right now the app fetches lessons in a *second* request. Learning to
  nest related data in one query is a core Prisma skill.
- **Concept:** Prisma's `include` fetches related rows in the same query.
- **Hint:**
  ```ts
  return this.prisma.course.findUnique({
    where: { id },
    include: { lessons: true }, // adds a `lessons: [...]` array to the result
  })
  ```
- **Verify:** `curl http://localhost:3000/courses/1` — the response now has a
  `lessons` array.
- **Stretch:** update the frontend `Course` type in `frontend/src/types/api.ts`
  (already has an optional `lessons?`) and use it instead of the separate call.

### Task 1.3 — Make deleting a course work when it has lessons/enrollments (US-014)

- [ ] **What:** Deleting a course that has lessons or enrollments currently fails
      with a database error. Make it succeed.
- **Where:** the schema
  [`../backend/prisma/schema.prisma`](../backend/prisma/schema.prisma) **and/or**
  [`../backend/src/courses/courses.service.ts`](../backend/src/courses/courses.service.ts)
  → `remove()`.
- **Why:** A foreign key stops you from deleting a "parent" (Course) while
  "children" (Lesson, Enrollment) still point to it.
- **Concept — two valid approaches. Pick ONE:**
  - **A) Cascade at the database level.** Add `onDelete: Cascade` to the relations
    so the DB removes children automatically:
    ```prisma
    // in Lesson and in Enrollment, on the `course` relation:
    course  Course  @relation(fields: [courseId], references: [id], onDelete: Cascade)
    ```
    Then run a migration:
    ```bash
    npx prisma migrate dev --name cascade_delete
    ```
  - **B) Clean up in code.** Delete children first, all-or-nothing, in a
    transaction (see the commented hint in `remove()`):
    ```ts
    return this.prisma.$transaction([
      this.prisma.lesson.deleteMany({ where: { courseId: id } }),
      this.prisma.enrollment.deleteMany({ where: { courseId: id } }),
      this.prisma.course.delete({ where: { id } }),
    ])
    ```
- **Verify:** create a course, add a lesson, enroll in it, then delete the course
  from the app. It should delete without an error and disappear from the list.

### Task 1.4 — Return clean 404s instead of `null` / 500

- [ ] **What:** When a course/lesson/user id doesn't exist, return a clear
      **404 Not Found** with a message.
- **Where:** the `findById` / `findOne` / `update` / `remove` methods in
  [`courses.service.ts`](../backend/src/courses/courses.service.ts),
  [`lessons.service.ts`](../backend/src/lessons/lessons.service.ts),
  [`users.service.ts`](../backend/src/users/users.service.ts).
- **Why:** Today, a missing id returns `null` with status 200 (looks like success)
  or throws a raw 500. A 404 tells the client exactly what happened.
- **Concept:** NestJS exceptions map to HTTP status codes automatically.
- **Hint:**
  ```ts
  import { NotFoundException } from '@nestjs/common'
  const course = await this.prisma.course.findUnique({ where: { id } })
  if (!course) throw new NotFoundException(`Course ${id} not found`)
  return course
  ```
- **Verify:** `curl -i http://localhost:3000/courses/999999` returns HTTP **404**
  with a message.

### Task 1.5 — Require login to list users (US-025)

- [ ] **What:** Protect `GET /users` so only logged-in users can list everyone.
- **Where:** [`../backend/src/users/users.controller.ts`](../backend/src/users/users.controller.ts)
  → `findAll()`.
- **Why:** The features doc says viewing all users needs a logged-in user.
- **Hint:** add the same guard the routes below it use:
  ```ts
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() { ... }
  ```
- **Verify:** `curl -i http://localhost:3000/users` (no token) returns **401**;
  with a valid `Authorization: Bearer <token>` it returns the list. The app still
  works because it only opens the Users page when you're logged in.

### Task 1.6 — Move the JWT secret to an environment variable

- [ ] **What:** Stop hardcoding the JWT secret in two files; read it from `.env`.
- **Where:** [`../backend/src/auth/auth.module.ts`](../backend/src/auth/auth.module.ts)
  and [`../backend/src/auth/strategies/jwt.strategy.ts`](../backend/src/auth/strategies/jwt.strategy.ts).
- **Why:** Secrets should never live in source code. `@nestjs/config` is already
  installed.
- **Hint (high level):** add `JWT_SECRET=...` to `.env`, import `ConfigModule`
  in `AppModule`, then read `process.env.JWT_SECRET` (via `ConfigService`) in
  **both** places. They must use the **same** value or existing tokens break.
- **Verify:** log in, then make an authenticated request — it still works. Change
  the secret in `.env` and old tokens should stop working (you'd need to log in
  again).

### Task 1.7 (optional) — Clean up the leftover template bits

- [ ] `AppController`/`AppService` aren't registered and still say
      "expense tracker" — either wire them up in
      [`../backend/src/app.module.ts`](../backend/src/app.module.ts) and rename the
      text to TeachHub, or delete `app.controller.ts` / `app.service.ts`.
- [ ] The backend `package.json` `name` is still `"expenso"` — rename it to
      `teachhub-backend`.

---

## Section 2 — Frontend tasks (extend the SPA)

The app already covers every core feature. These are guided exercises to learn the
codebase by adding to it.

- [ ] **Search / filter courses.** On the Courses page, add a text box that
      filters the grid by title. *Where:* `frontend/src/pages/CoursesPage.tsx`.
      *Hint:* keep the query in `useState`, then filter `courses` before mapping.

- [ ] **Show lesson count on each course card.** Once Task 1.2 is done and courses
      include `lessons`, display "N lessons" on the card. *Where:*
      `frontend/src/components/CourseCard.tsx`.

- [ ] **Unenroll button.** After the backend gains an unenroll endpoint (a nice
      backend stretch task!), add an "Unenroll" action on the My Learning page.
      *Where:* add a mutation in `frontend/src/hooks/useCourses.ts` and a button in
      `frontend/src/pages/MyProfilePage.tsx`.

- [ ] **Loading skeletons.** Replace the spinner on the Courses page with grey
      "skeleton" cards while loading, for a smoother feel. *Where:* a new component
      in `frontend/src/components/ui/`.

- [ ] **Pagination or "load more"** on the courses list once there are many
      courses. (You'll likely add a `?page=` query param to the backend too — a
      good cross-stack exercise.)

- [ ] **Write one component test.** Add `vitest` + `@testing-library/react` and
      test that `<CourseCard>` renders the title and price.

---

## Section 3 — Definition of Done (map to the features)

Use this to confirm the whole app works. Check each once you've verified it in the
running app.

**Authentication**
- [ ] Register a new account → you're taken straight into the app (US-001, 005)
- [ ] Validation errors show on bad input (US-002)
- [ ] Registering a duplicate email shows "Email already exists" (US-003)
- [ ] Log in / log out works; wrong password shows an error (US-004, 006)

**Courses**
- [ ] See the list of all courses with title, description, price (US-009, 010)
- [ ] Create a course (validated) (US-007, 008)
- [ ] Open a course's detail page (US-015)
- [ ] Course detail shows its lessons (US-016 — needs Task 1.2 for one-request)
- [ ] Update a course; changes are confirmed (US-011, 012)
- [ ] Delete a course (US-013); works even with lessons/enrollments (US-014 → Task 1.3)

**Lessons**
- [ ] Add a lesson to a course (logged in) (US-017, 018)
- [ ] See all lessons in a course (US-019, 020)
- [ ] Update a lesson; stays in the same course (US-021, 022)
- [ ] Delete a lesson with confirmation (US-023, 024)

**Users**
- [ ] View all users (US-025 → Task 1.5 to require login)
- [ ] View any user's profile (US-026)
- [ ] View your own profile (US-027)
- [ ] View a user's enrolled courses (US-028 → Task 1.1)
- [ ] View your own enrolled courses (US-029)

**Enrollment**
- [ ] Enroll in a course (US-030)
- [ ] Enrolling twice shows "already enrolled" (US-031)
- [ ] Enrolling shows a success confirmation (US-032)

---

## Glossary (quick beginner definitions)

- **JWT (JSON Web Token):** a signed string the server gives you at login. You send
  it back on future requests to prove who you are.
- **Guard (NestJS):** code that runs before a route and can block the request
  (e.g. `JwtAuthGuard` blocks requests without a valid token → 401).
- **DTO (Data Transfer Object):** a class describing the shape of incoming request
  data, with validation rules (e.g. `CreateCourseDto`).
- **Migration:** a versioned change to the database structure. `prisma migrate dev`
  creates and applies one from your `schema.prisma`.
- **CORS:** a browser security rule about calling a different origin. The backend
  allows the frontend origin so the browser doesn't block requests.
- **Proxy (Vite):** the dev server forwarding `/api/...` calls to the backend so
  the two feel like one origin during development.
- **Query / Mutation (TanStack Query):** a *query* reads data (cached); a
  *mutation* changes data (create/update/delete).
- **Cache invalidation:** telling TanStack Query "this data is now stale, refetch
  it" — how the UI updates after you change something.
