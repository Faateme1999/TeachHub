# TeachHub — Features & User Stories

A learning platform with **two kinds of user**:

- **Student** — the default. Registers by self sign-up, browses courses, and enrolls.
- **Admin** — manages courses and lessons and can create other admins. Works in a
  separate `/admin` section. The app ships with one pre-defined **seed admin**; only an
  admin can create more.

---

## Roles at a glance

| Action | Student | Admin |
|--------|:-------:|:-----:|
| Register / log in | ✅ (self sign-up → student) | ✅ (created by seed or another admin) |
| Browse courses & lessons | ✅ | ✅ |
| Enroll in a course | ✅ | ✅ |
| Create / edit / delete courses | ❌ | ✅ |
| Create / edit / delete lessons | ❌ | ✅ |
| View all users | ❌ | ✅ |
| Create another admin | ❌ | ✅ |

---

## User Journey

**Student**
```
Register (as student) → Login → Browse Course List → View Course Details & Lessons → Enroll
```

**Admin**
```
Login (seed or created admin) → /admin → Manage Courses & Lessons → Manage Users → Create Admin
```

---

## 1. Authentication

### User Registration
- **US-001** — As a new user, I want to register with my name, email, and password, so that I can access the platform.
- **US-002** — As a new user, I want to receive clear validation errors when my input is invalid, so that I can fix my details and try again.
- **US-003** — As a new user, I want to be prevented from registering with an email that is already in use, so that each account remains unique.

### User Login
- **US-004** — As a registered user, I want to log in with my email and password, so that I can access platform features.
- **US-005** — As a registered user, I want to receive an authentication token on successful login, so that I can make authenticated requests.
- **US-006** — As a registered user, I want to see a clear error when my credentials are incorrect, so that I know my login attempt failed.

---

## 2. Course Management

### Create Course
- **US-007** — As an **admin**, I want to create a course with a title, description, and price, so that I can publish learning content.
- **US-008** — As an **admin**, I want required fields to be validated when creating a course, so that only complete course records are saved.

### View All Courses
- **US-009** — As a user, I want to view a list of all courses, so that I can browse available learning content.
- **US-010** — As a user, I want each course listing to show title, description, and price, so that I can compare courses.

### Update Course
- **US-011** — As an **admin**, I want to update a course's title, description, or price, so that course information stays up to date.
- **US-012** — As an **admin**, I want confirmation after a course is updated successfully, so that I know my changes were saved.

### Delete Course
- **US-013** — As an **admin**, I want to delete a course, so that outdated or incorrect content can be removed from the platform.
- **US-014** — As an **admin**, I want related lessons and enrollments to be handled correctly when a course is deleted, so that the platform stays consistent.

### View Course Details
- **US-015** — As a user, I want to view the full details of a course, so that I can understand what it covers.
- **US-016** — As a user, I want the course detail page to include its lessons, so that I can see all content within that course.

---

## 3. Lesson Management

### Create Lesson for a Course
- **US-017** — As an **admin**, I want to create a lesson with a title and content for a course, so that I can build the course curriculum.
- **US-018** — As an **admin**, I want each lesson to belong to exactly one course, so that content stays organized.

### View Lessons in a Course
- **US-019** — As a user, I want to view all lessons in a course, so that I can review its learning plan.
- **US-020** — As a user, I want to view each lesson's details (title, content, creation date), so that I can read the full lesson content.

### Update Lesson
- **US-021** — As an **admin**, I want to update a lesson's title or content, so that I can improve course material.
- **US-022** — As an **admin**, I want an updated lesson to remain linked to the same course, so that the curriculum structure is preserved.

### Delete Lesson
- **US-023** — As an **admin**, I want to delete a lesson from a course, so that outdated or incorrect material can be removed.
- **US-024** — As an **admin**, I want confirmation after a lesson is deleted successfully, so that I know the action completed.

---

## 4. User Management

### View All Users
- **US-025** — As an **admin**, I want to view a list of all users on the platform, so that I can see who is registered.

### View User Profile
- **US-026** — As an **admin**, I want to view any user's profile (name, email, role, registration date), so that I can learn more about them.
- **US-027** — As a logged-in user, I want to view my own profile, so that I can review my account information.

### View Enrolled Courses
- **US-028** — As a logged-in user, I want to view the courses a user has enrolled in, so that I can see their learning activity.
- **US-029** — As a logged-in user, I want to view my own enrolled courses, so that I can quickly access my learning content.

---

## 5. Course Enrollment

### Enroll in a Course
- **US-030** — As a logged-in user, I want to enroll in a course, so that I can access its lessons.
- **US-031** — As a logged-in user, I want to be prevented from enrolling in the same course more than once, so that duplicate enrollments do not occur.
- **US-032** — As a logged-in user, I want confirmation after enrolling in a course successfully, so that I know I have access to the content.

---

## 6. Roles & Admin

### Roles
- **US-033** — As a new user, I want self sign-up to always create a **student** account, so that admin powers can never be gained by registering.
- **US-034** — As the platform, I want course/lesson management endpoints to reject non-admins with **403 Forbidden**, so that only admins can change content (enforced by a roles guard, not just hidden UI).

### Admin Accounts
- **US-035** — As the platform, I want one pre-defined **seed admin** to exist after seeding, so that there is always a way to administer the app.
- **US-036** — As an **admin**, I want a dedicated `/admin` section (separate layout), so that management tasks are grouped away from the student experience.
- **US-037/038** — As an **admin**, I want to manage courses/lessons and view all users from the admin section.
- **US-039** — As an **admin**, I want to create another admin account (name, email, password), so that I can share administration. The role is fixed to admin by the server — it is never chosen by the request.

---

## Feature Summary

| Step | Features | Who |
|------|----------|-----|
| 1. Authentication | Registration (→ student), Login | Anyone |
| 2. Course Management | Create, Update, Delete | **Admin** |
| 2. Course Browsing | View List, View Details | Anyone |
| 3. Lesson Management | Create, Update, Delete | **Admin** |
| 3. Lesson Viewing | View Lessons | Anyone |
| 4. User Management | View All Users, User Profile | **Admin** |
| 5. Course Enrollment | Enroll in a Course | Student (any logged-in) |
| 6. Roles & Admin | Seed admin, Admin section, Create admin | **Admin** |

---

## Platform Capabilities

| Capability | Description |
|------------|-------------|
| User Authentication | Registration (always student) and login with JWT (role in the token) |
| Roles / RBAC | Two roles (STUDENT, ADMIN); admin-only routes enforced by a roles guard |
| Profile Management | View user information and enrolled courses |
| Course CRUD | Admin-only create/update/delete; public read |
| Lesson CRUD | Admin-only create/update/delete; public read |
| Admin management | Seed admin + admin-creates-admin |
