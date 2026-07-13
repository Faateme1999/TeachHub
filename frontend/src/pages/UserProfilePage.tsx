import { useParams, Link } from 'react-router-dom'
import { useUser, useUserCourses } from '../hooks/useUsers'
import { getInitials, formatDate } from '../lib/format'
import { CourseCard } from '../components/CourseCard'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState, ErrorState } from '../components/ui/States'
import '../components/components.css'

// A specific user's public profile + the courses they're enrolled in.
//
// IMPORTANT: the "enrolled courses" endpoint (GET /users/:id/courses) is a
// backend STUB that returns 501 for now. So instead of crashing, we detect the
// error and show a friendly "coming soon" message. Once a junior finishes that
// endpoint (see docs/junior-dev-tasks.md), this section will just start working.
export function UserProfilePage() {
  const { id } = useParams()
  const userId = Number(id)

  const userQuery = useUser(userId)
  const coursesQuery = useUserCourses(userId)

  if (userQuery.isLoading) return <Spinner center />
  if (userQuery.isError || !userQuery.data) {
    return <ErrorState title="User not found" />
  }

  const user = userQuery.data

  return (
    <div>
      {/* This page now lives inside the admin section (/admin/users/:id), so the
          back-link points to the admin user list. */}
      <Link to="/admin/users" className="navbar__link" style={{ paddingLeft: 0 }}>
        ← All users
      </Link>

      <Card style={{ marginTop: 'var(--space-3)' }}>
        <div className="profile-header">
          <span className="avatar" aria-hidden="true">
            {getInitials(user.name)}
          </span>
          <div>
            <h1 style={{ margin: 0 }}>{user.name}</h1>
            <p className="user-row__email">{user.email}</p>
            <p className="page-header__subtitle">Joined {formatDate(user.createdAt)}</p>
          </div>
        </div>
      </Card>

      <section className="detail__section">
        <h2>Enrolled courses</h2>

        {coursesQuery.isLoading && <Spinner center />}

        {/* The endpoint isn't implemented yet — show a gentle placeholder. */}
        {coursesQuery.isError && (
          <EmptyState
            icon="🚧"
            title="Coming soon"
            message="Viewing another user's enrolled courses isn't available yet."
          />
        )}

        {coursesQuery.data && coursesQuery.data.length === 0 && (
          <EmptyState icon="📚" title="Not enrolled in any courses yet" />
        )}

        {coursesQuery.data && coursesQuery.data.length > 0 && (
          <div className="course-grid">
            {coursesQuery.data.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
