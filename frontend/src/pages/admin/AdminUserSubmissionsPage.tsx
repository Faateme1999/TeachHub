import { Link, useParams } from "react-router-dom";
import { useUser, useUserSubmissions } from "../../hooks/useUsers";
import { useDownloadSubmission } from "../../hooks/useAssignments";

export function AdminUserSubmissionsPage() {
  const { id } = useParams();
  const userId = Number(id);

  const { data: user, isLoading: isUserLoading } = useUser(userId);

  const {
    data: submissions,
    isLoading: isSubmissionsLoading,
    isError,
  } = useUserSubmissions(userId);

  const downloadSubmission = useDownloadSubmission();

  const handleDownload = async (
    assignmentId: number,
    submissionId: number,
    fileName: string,
  ) => {
    const response = await downloadSubmission.mutateAsync({
      assignmentId,
      submissionId,
    });

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  if (isUserLoading || isSubmissionsLoading) {
    return (
      <div className="admin-submissions-page">
        <div className="admin-submissions-loading">Loading submissions...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-submissions-page">
        <div className="admin-submissions-empty">
          <h2>User not found</h2>

          <Link to="/admin/users" className="admin-back-link">
            ← Back to users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-submissions-page">
      <div className="admin-submissions-header">
        <div>
          <Link to="/admin/users" className="admin-back-link">
            ← Back to users
          </Link>

          <h1>{user.name}'s Assignments</h1>

          <p className="admin-submissions-user-email">{user.email}</p>
        </div>
      </div>

      {isError && (
        <div className="admin-submissions-message admin-submissions-message--error">
          Failed to load this student's submissions.
        </div>
      )}

      {!isError && (!submissions || submissions.length === 0) && (
        <div className="admin-submissions-empty">
          <h2>No submissions yet</h2>

          <p>This student has not submitted any assignments yet.</p>
        </div>
      )}

      {submissions && submissions.length > 0 && (
        <div className="admin-submissions-list">
          {submissions.map((submission) => (
            <article key={submission.id} className="admin-submission-card">
              <h2>{submission.assignment.title}</h2>

              <div className="admin-submission-details">
                <div className="admin-submission-detail">
                  <span>Course:</span>

                  <strong>{submission.assignment.lesson.course.title}</strong>
                </div>

                <div className="admin-submission-detail">
                  <span>Lesson:</span>

                  <strong>{submission.assignment.lesson.title}</strong>
                </div>

                <div className="admin-submission-detail">
                  <span>Assignment:</span>

                  <strong>{submission.assignment.title}</strong>
                </div>

                <div className="admin-submission-detail">
                  <span>File:</span>

                  <strong>{submission.fileName}</strong>
                </div>
              </div>

              <div className="admin-submission-actions">
                <button
                  type="button"
                  className="admin-action-button admin-action-button--primary"
                  onClick={() =>
                    handleDownload(
                      submission.assignment.id,
                      submission.id,
                      submission.fileName,
                    )
                  }
                  disabled={downloadSubmission.isPending}
                >
                  {downloadSubmission.isPending
                    ? "Downloading..."
                    : "View / Download"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
