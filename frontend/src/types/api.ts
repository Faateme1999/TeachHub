// Shared "shapes" of the data our backend sends back.
// Keeping these in one place means every page/hook agrees on what a Course,
// User, or Lesson looks like. If the backend changes a field, you update it here.
//
// NOTE: because this project uses `verbatimModuleSyntax`, other files must import
// these with `import type { ... }` (they're types, not runtime values).

export interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface Course {
  id: number
  title: string
  description: string
  price: number
  createdAt: string
  // The backend does not include lessons here yet (that's a junior TODO),
  // so we fetch them separately. Marked optional in case it starts appearing.
  lessons?: Lesson[]
}

export interface Lesson {
  id: number
  title: string
  content: string
  courseId: number
  createdAt: string
}

// The backend returns this from POST /auth/login.
export interface LoginResponse {
  message: string
  accessToken: string
  user: User
}

// The backend returns this from POST /auth/register (note: NO token).
export interface RegisterResponse {
  message: string
  user: User
}

// What we send when creating/updating a course.
export interface CourseInput {
  title: string
  description: string
  price: number
}

// What we send when creating/updating a lesson.
export interface LessonInput {
  title: string
  content: string
}
