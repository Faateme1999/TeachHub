import { Link, useParams } from "react-router-dom";
import { useAssignments } from "../hooks/useAssignments";
import { Spinner } from "../components/ui/Spinner";
import { EmptyState, ErrorState } from "../components/ui/States";
import { AssignmentCard } from "../components/AssignmentCard";



export function AssignmentPage() {
  const { courseId, lessonId } = useParams();
  const parsedLessonId = Number(lessonId);

  const assignmentsQuery = useAssignments(parsedLessonId);

  if (assignmentsQuery.isLoading) {
    return <Spinner center />;
  }

  if (assignmentsQuery.isError) {
    return (
      <ErrorState
        title="Could not load assignments"
        message="There was a problem loading the assignments for this lesson."
      />
    );
  }

  const assignments = assignmentsQuery.data ?? [];

  return (
    <div>
      <Link to="/courses" className="navbar__link" style={{ paddingLeft: 0 }}>
        ← Back to courses
      </Link>

      <section
        className="detail__section"
        style={{ marginTop: "var(--space-5)" }}
      >
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Assignments</h1>
            <p className="page-header__subtitle">Assignments for this lesson</p>
          </div>
        </div>

        {assignments.length === 0 && (
          <EmptyState
            icon="📝"
            title="No assignments yet"
            message="There are no assignments for this lesson."
          />
        )}

        {assignments.length > 0 && (
          <div className="stack">
            {assignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}

        <div style={{ marginTop: "var(--space-5)" }}>
          <Link
            to={`/courses/${courseId}`}
            className="navbar__link"
            style={{ paddingLeft: 0 }}
          >
            ← Back to course
          </Link>
        </div>
      </section>
    </div>
  );
}
