import { EmptyState } from '../../components/ui/States'

// Admin course management. Reached at /admin/courses.
//
// TODO(junior) — US-037 (manage courses): build the real UI here. Everything you
// need already exists in the codebase:
//   - List courses:            useCourses()               (hooks/useCourses.ts)
//   - Create a course:          useCreateCourse()          + <CourseForm />
//   - Edit a course:            useUpdateCourse(id)         + <CourseForm />
//   - Delete a course:          useDeleteCourse()          + <ConfirmDialog />
//   - Manage a course's lessons: useLessons / useCreateLesson / useUpdateLesson /
//                                useDeleteLesson (hooks/useLessons.ts) + <LessonForm />
// Suggested layout: a table/grid of courses with Edit/Delete actions and a
// "+ New course" button. You can lift the pieces from the existing
// CoursesPage / CourseDetailPage / CreateCoursePage / EditCoursePage.
//
// Because this whole page sits behind <AdminRoute> and the backend routes are
// guarded by @Roles(ADMIN), you don't need per-button role checks here.
export function AdminCoursesPage() {
  return (
    <div>
      <h1 className="page-header__title">Manage courses</h1>
      <EmptyState
        icon="🛠️"
        title="Course management — TODO(junior)"
        message="Build the create/edit/delete course + lessons UI here. See the TODO comment in AdminCoursesPage.tsx for the exact hooks to use."
      />
    </div>
  )
}
