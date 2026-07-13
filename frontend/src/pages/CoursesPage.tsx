import { Link } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses'
import { useAuth } from '../context/auth-context'
import { getApiErrorMessage } from '../lib/apiClient'
import { CourseCard } from '../components/CourseCard'
import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState, ErrorState } from '../components/ui/States'
import '../components/components.css'

// The main landing page: a welcome hero + a grid of every course.
// Logged-in users also get a "New course" button.
export function CoursesPage() {
  const { isAuthenticated } = useAuth()
  const { data: courses, isLoading, isError, error } = useCourses()

  return (
    <div>
      <section className="hero">
        <h1>Learn something new on TeachHub</h1>
        <p>
          Browse community-made courses, follow along with the lessons, and enroll
          in the ones you like.
        </p>
      </section>

      <div className="page-header">
        <div>
          <h2 className="page-header__title">All courses</h2>
          <p className="page-header__subtitle">
            {courses ? `${courses.length} available` : 'Discover what to learn next'}
          </p>
        </div>
        {isAuthenticated && (
          <Link to="/courses/new">
            <Button>+ New course</Button>
          </Link>
        )}
      </div>

      {isLoading && <Spinner center />}

      {isError && (
        <ErrorState message={getApiErrorMessage(error, 'Could not load courses')} />
      )}

      {courses && courses.length === 0 && (
        <EmptyState
          icon="📚"
          title="No courses yet"
          message={
            isAuthenticated
              ? 'Be the first to create one!'
              : 'Log in to create the first course.'
          }
          action={
            isAuthenticated ? (
              <Link to="/courses/new">
                <Button>Create a course</Button>
              </Link>
            ) : undefined
          }
        />
      )}

      {courses && courses.length > 0 && (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
