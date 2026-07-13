import { Link } from 'react-router-dom'
import { useMyProfile, useMyCourses } from '../hooks/useUsers'
import { useAuth } from '../context/auth-context'
import { getInitials, formatDate } from '../lib/format'
import { CourseCard } from '../components/CourseCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState, ErrorState } from '../components/ui/States'
import '../components/components.css'

// The logged-in user's own profile + the courses they've enrolled in.
// Unlike UserProfilePage, "my courses" uses GET /users/me/courses which IS
// implemented, so it works fully. ProtectedRoute (login required).
export function MyProfilePage() {
  const { user } = useAuth()
  const profileQuery = useMyProfile()
  const coursesQuery = useMyCourses()

  // Prefer the freshly-fetched profile, fall back to the user stored at login.
  const profile = profileQuery.data ?? user

  return (
    <div>
      <Card>
        {profileQuery.isLoading && !profile ? (
          <Spinner center />
        ) : profile ? (
          <div className="profile-header">
            <span className="avatar" aria-hidden="true">
              {getInitials(profile.name)}
            </span>
            <div>
              <h1 style={{ margin: 0 }}>{profile.name}</h1>
              <p className="user-row__email">{profile.email}</p>
              {profile.createdAt && (
                <p className="page-header__subtitle">
                  Joined {formatDate(profile.createdAt)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <ErrorState title="Could not load your profile" />
        )}
      </Card>

      <section className="detail__section">
        <h2>My courses</h2>

        {coursesQuery.isLoading && <Spinner center />}
        {coursesQuery.isError && <ErrorState message="Could not load your courses." />}

        {coursesQuery.data && coursesQuery.data.length === 0 && (
          <EmptyState
            icon="🎯"
            title="You haven't enrolled in anything yet"
            message="Browse the catalog and enroll in your first course."
            action={
              <Link to="/courses">
                <Button>Browse courses</Button>
              </Link>
            }
          />
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
