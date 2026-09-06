// Shared "shapes" of the data our backend sends back.
// Keeping these in one place means every page/hook agrees on what a Course,
// User, or Lesson looks like. If the backend changes a field, you update it here.
//
// NOTE: because this project uses `verbatimModuleSyntax`, other files must import
// these with `import type { ... }` (they're types, not runtime values).

// A user's role. Mirrors the backend Prisma `Role` enum.
// NOTE: this is a string-union type, NOT a TS `enum` — this project has
// `erasableSyntaxOnly` on, which forbids enums. Compare with string literals:
// `user.role === 'ADMIN'`.
export type Role = "STUDENT" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  createdAt: string;
  // The backend does not include lessons here yet (that's a junior TODO),
  // so we fetch them separately. Marked optional in case it starts appearing.
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  courseId: number;
  createdAt: string;
}

// The backend returns this from POST /auth/login.
export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

// The backend returns this from POST /auth/register (note: NO token).
export interface RegisterResponse {
  message: string;
  user: User;
}

// What we send when creating/updating a course.
export interface CourseInput {
  title: string;
  description: string;
  price: number;
}

// What we send when creating/updating a lesson.
export interface LessonInput {
  title: string;
  content: string;
}

export interface Outcome {
  id: number;
  text: string;
  lessonId: number;
}

export interface OutcomeInput {
  text: string;
}

export interface Mission {
  id: number;
  title: string;
  order: number;
  passingScore: number;
  maxAttempts: number;
  outcomeId: number;
}

// What we send to POST /auth/admins to create another admin. Same fields as
// sign-up — the role is decided by the backend (always ADMIN), never sent here.
export interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
}

export interface PaginatedCourses {
  courses: Course[];
  page: number;
  totalPages: number;
  total: number;
}
