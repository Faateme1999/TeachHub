# Features vs Backend API Coverage

Comparison of documented features in [features.md](./features.md) against the current NestJS backend (`http://localhost:3000`).

**Legend:** ✅ Implemented · ⚠️ Partial · ❌ Missing

---

## API Endpoint Reference

| Method | Endpoint | Auth | Controller |
|--------|----------|------|------------|
| `POST` | `/auth/register` | Public | `AuthController` |
| `POST` | `/auth/login` | Public | `AuthController` |
| `GET` | `/users` | Public | `UsersController` |
| `GET` | `/users/my-profile` | JWT | `UsersController` |
| `GET` | `/users/me/courses` | JWT | `UsersController` |
| `GET` | `/users/:id` | Public | `UsersController` |
| `GET` | `/courses` | Public | `CoursesController` |
| `GET` | `/courses/:id` | Public | `CoursesController` |
| `POST` | `/courses` | JWT | `CoursesController` |
| `PATCH` | `/courses/:id` | JWT | `CoursesController` |
| `DELETE` | `/courses/:id` | JWT | `CoursesController` |
| `POST` | `/courses/:id/enroll` | JWT | `CoursesController` |
| `GET` | `/courses/:courseId/lessons` | Public | `LessonsController` |
| `POST` | `/courses/:courseId/lessons` | Public | `LessonsController` |
| `GET` | `/lessons/:id` | Public | `LessonsController` |
| `PATCH` | `/lessons/:id` | Public | `LessonsController` |
| `DELETE` | `/lessons/:id` | Public | `LessonsController` |

---

## 1. Authentication

| Feature | User Story | Endpoint | Status | Notes |
|---------|------------|----------|--------|-------|
| User Registration | US-001 | `POST /auth/register` | ✅ | Creates user with name, email, password |
| Validation errors | US-002 | `POST /auth/register` | ✅ | Global `ValidationPipe` + DTO validators (`CreateUserDto`) |
| Unique email | US-003 | `POST /auth/register` | ✅ | Returns `400` — *"Email already exists"* |
| User Login | US-004 | `POST /auth/login` | ✅ | Email + password login |
| JWT token | US-005 | `POST /auth/login` | ✅ | Returns `accessToken` in response |
| Invalid credentials | US-006 | `POST /auth/login` | ✅ | Returns `401` — *"Invalid email or password"* |

**Coverage: 6 / 6 ✅**

---

## 2. Course Management

| Feature | User Story | Endpoint | Status | Notes |
|---------|------------|----------|--------|-------|
| Create Course | US-007 | `POST /courses` | ✅ | Requires JWT; accepts title, description, price |
| Field validation | US-008 | `POST /courses` | ✅ | `CreateCourseDto` validates required fields and `@Min(0)` on price |
| View All Courses | US-009 | `GET /courses` | ✅ | Public endpoint |
| Course list fields | US-010 | `GET /courses` | ✅ | Returns title, description, price, createdAt |
| Update Course | US-011 | `PATCH /courses/:id` | ✅ | Requires JWT |
| Update confirmation | US-012 | `PATCH /courses/:id` | ✅ | Returns updated course object |
| Delete Course | US-013 | `DELETE /courses/:id` | ✅ | Requires JWT |
| Cascade on delete | US-014 | `DELETE /courses/:id` | ⚠️ | No `onDelete: Cascade` in Prisma schema — delete may fail if lessons or enrollments exist |
| View Course Details | US-015 | `GET /courses/:id` | ✅ | Returns course fields only |
| Course includes lessons | US-016 | `GET /courses/:id` | ⚠️ | Course detail does **not** include lessons; use `GET /courses/:courseId/lessons` separately |

**Coverage: 8 / 10 fully implemented · 2 partial**

---

## 3. Lesson Management

| Feature | User Story | Endpoint | Status | Notes |
|---------|------------|----------|--------|-------|
| Create Lesson | US-017 | `POST /courses/:courseId/lessons` | ⚠️ | Endpoint exists; **no JWT guard** (docs expect logged-in user) |
| Lesson linked to course | US-018 | `POST /courses/:courseId/lessons` | ✅ | `courseId` from URL is stored on the lesson |
| View Lessons in Course | US-019 | `GET /courses/:courseId/lessons` | ✅ | Public endpoint |
| View Lesson Details | US-020 | `GET /lessons/:id` | ✅ | Returns title, content, courseId, createdAt |
| Update Lesson | US-021 | `PATCH /lessons/:id` | ⚠️ | Endpoint exists; **no JWT guard** |
| Lesson stays linked | US-022 | `PATCH /lessons/:id` | ✅ | Update DTO does not change `courseId` |
| Delete Lesson | US-023 | `DELETE /lessons/:id` | ⚠️ | Endpoint exists; **no JWT guard** |
| Delete confirmation | US-024 | `DELETE /lessons/:id` | ✅ | Returns deleted lesson object |

**Coverage: 5 / 8 fully implemented · 3 partial (missing auth)**

---

## 4. User Management

| Feature | User Story | Endpoint | Status | Notes |
|---------|------------|----------|--------|-------|
| View All Users | US-025 | `GET /users` | ⚠️ | Endpoint exists; **public** (docs expect logged-in user) |
| View User Profile | US-026 | `GET /users/:id` | ✅ | Returns id, name, email, createdAt (password excluded) |
| View My Profile | US-027 | `GET /users/my-profile` | ✅ | Requires JWT; returns user from token |
| View user's enrolled courses | US-028 | — | ❌ | No `GET /users/:id/courses` — only current user via `/users/me/courses` |
| View My Enrolled Courses | US-029 | `GET /users/me/courses` | ✅ | Requires JWT; returns enrolled course list |

**Coverage: 3 / 5 fully implemented · 1 partial · 1 missing**

---

## 5. Course Enrollment

| Feature | User Story | Endpoint | Status | Notes |
|---------|------------|----------|--------|-------|
| Enroll in Course | US-030 | `POST /courses/:id/enroll` | ✅ | Requires JWT; uses authenticated user id |
| Prevent duplicate | US-031 | `POST /courses/:id/enroll` | ✅ | Returns `400` — *"User is already enrolled in this course"* |
| Enrollment confirmation | US-032 | `POST /courses/:id/enroll` | ✅ | Returns created enrollment record |

**Coverage: 3 / 3 ✅**

---

## Overall Summary

| Area | Stories | ✅ | ⚠️ | ❌ |
|------|---------|----|----|-----|
| Authentication | 6 | 6 | 0 | 0 |
| Course Management | 10 | 8 | 2 | 0 |
| Lesson Management | 8 | 5 | 3 | 0 |
| User Management | 5 | 3 | 1 | 1 |
| Course Enrollment | 3 | 3 | 0 | 0 |
| **Total** | **32** | **25** | **6** | **1** |

**Backend coverage: ~78% fully implemented · ~19% partial · ~3% missing**

---

## Gaps to Address

### Missing endpoint
1. **`GET /users/:id/courses`** — View enrolled courses for any user (US-028)

### Auth not enforced (docs say logged-in user required)
2. **`GET /users`** — Should require JWT (US-025)
3. **`POST /courses/:courseId/lessons`** — Should require JWT (US-017)
4. **`PATCH /lessons/:id`** — Should require JWT (US-021)
5. **`DELETE /lessons/:id`** — Should require JWT (US-023)

### Data / behavior gaps
6. **`GET /courses/:id`** — Does not include nested lessons (US-016); clients must call `/courses/:courseId/lessons` separately, or backend should add `include: { lessons: true }`
7. **`DELETE /courses/:id`** — No cascade delete for related lessons and enrollments (US-014); add Prisma `onDelete: Cascade` or explicit cleanup in service

### Not in features doc (extra backend endpoints)
- `GET /` — Health/hello response (`AppController`)
- `GET /about` — App metadata (`AppController`)

---

## User Journey vs API Flow

```
Register          → POST /auth/register                          ✅
Login             → POST /auth/login                             ✅
Create Course     → POST /courses                                ✅
View Course List  → GET /courses                                 ✅
Update Course     → PATCH /courses/:id                           ✅
Delete Course     → DELETE /courses/:id                          ⚠️ cascade
Create Lesson     → POST /courses/:courseId/lessons              ⚠️ no auth
View Course + Lessons → GET /courses/:id + GET /courses/:id/lessons  ⚠️ two calls
Update Lesson     → PATCH /lessons/:id                           ⚠️ no auth
Delete Lesson     → DELETE /lessons/:id                          ⚠️ no auth
View All Users    → GET /users                                   ⚠️ no auth
User Profile      → GET /users/:id                               ✅
My Profile        → GET /users/my-profile                        ✅
Enrolled Courses  → GET /users/me/courses                        ✅
Other User Courses → GET /users/:id/courses                      ❌
Enroll in Course  → POST /courses/:id/enroll                     ✅
```
