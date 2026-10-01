import { useMyCourses } from "../../hooks/useCourses";
import { getApiErrorMessage } from "../../lib/apiClient";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState, ErrorState } from "../../components/ui/States";
import { Link } from "react-router-dom";

export function TeacherDashboardPage() {
  const { data: courses, isLoading, isError, error } = useMyCourses();

  if (isLoading) {
    return (
      <div>
        <h1 className="page-header__title">Teacher dashboard</h1>
        <p className="page-header__subtitle">Loading your courses...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="page-header__title">Teacher dashboard</h1>
        <ErrorState
          message={getApiErrorMessage(error, "Could not load your courses")}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Teacher dashboard</h1>
          <p className="page-header__subtitle">
            Manage your courses and see enrolled students.
          </p>
        </div>

        <Link to="/courses/new">
          <Button>+ New course</Button>
        </Link>
      </div>

      {!courses || courses.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No courses yet"
          message="You haven't created any courses yet."
          action={
            <Link to="/courses/new">
              <Button>Create a course</Button>
            </Link>
          }
        />
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <Card key={course.id}>
              <h2 className="page-header__title">{course.title}</h2>

              <p>{course.description}</p>

              <p>
                <strong>Price:</strong> ${course.price}
              </p>

              <h3>Enrolled students</h3>

              {course.enrollments.length === 0 ? (
                <p>No students enrolled yet.</p>
              ) : (
                <ul>
                  {course.enrollments.map(({ user }) => (
                    <li key={user.id}>
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              )}

              <div style={{ marginTop: "var(--space-4)" }}>
                <Link to={`/courses/${course.id}`}>
                  <Button variant="secondary">View course</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
