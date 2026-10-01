import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyCourses } from "../../hooks/useCourses";
import { useUserSubmissions } from "../../hooks/useUsers";
import {
  useDownloadSubmission,
  useUploadCorrectedFile,
} from "../../hooks/useAssignments";
import { getApiErrorMessage } from "../../lib/apiClient";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState, ErrorState } from "../../components/ui/States";

function StudentSubmissions({ studentId }: { studentId: number }) {
  const {
    data: submissions,
    isLoading,
    isError,
  } = useUserSubmissions(studentId);

  const downloadSubmission = useDownloadSubmission();
  const uploadCorrectedFile = useUploadCorrectedFile();

  const [selectedFiles, setSelectedFiles] = useState<
    Record<number, File | null>
  >({});

  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});

  const [uploadedSubmissionId, setUploadedSubmissionId] = useState<
    number | null
  >(null);

  const handleFileChange = (submissionId: number, file: File | null) => {
    setSelectedFiles((current) => ({
      ...current,
      [submissionId]: file,
    }));
  };

  const handleFeedbackChange = (submissionId: number, feedback: string) => {
    setFeedbacks((current) => ({
      ...current,
      [submissionId]: feedback,
    }));
  };

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

  const handleUploadCorrection = async (
    assignmentId: number,
    submissionId: number,
  ) => {
    const file = selectedFiles[submissionId];

    if (!file) {
      return;
    }

    try {
      await uploadCorrectedFile.mutateAsync({
        assignmentId,
        submissionId,
        file,
        feedback: feedbacks[submissionId],
      });

      setUploadedSubmissionId(submissionId);

      setSelectedFiles((current) => ({
        ...current,
        [submissionId]: null,
      }));
    } catch {
      setUploadedSubmissionId(null);
    }
  };

  if (isLoading) {
    return <p>Loading submissions...</p>;
  }

  if (isError) {
    return <p>Failed to load this student's submissions.</p>;
  }

  if (!submissions || submissions.length === 0) {
    return <p>No submissions yet.</p>;
  }

  return (
    <div className="admin-submissions-list">
      {submissions.map((submission) => {
        const selectedFile = selectedFiles[submission.id] ?? null;

        const feedback = feedbacks[submission.id] ?? "";

        const isUploading =
          uploadCorrectedFile.isPending &&
          uploadCorrectedFile.variables?.submissionId === submission.id;

        const uploadSucceeded = uploadedSubmissionId === submission.id;

        return (
          <article key={submission.id} className="admin-submission-card">
            <h3>{submission.assignment.title}</h3>

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
                <span>Student file:</span>
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

            <div
              style={{
                marginTop: "var(--space-5)",
                padding: "var(--space-4)",
                background: "var(--surface-2)",
                borderRadius: "var(--radius)",
              }}
            >
              <h4>Correct this assignment</h4>

              <div style={{ marginTop: "var(--space-4)" }}>
                <label>
                  <strong>Corrected file</strong>

                  <input
                    type="file"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      handleFileChange(submission.id, file);
                    }}
                    disabled={isUploading}
                    style={{
                      display: "block",
                      marginTop: "var(--space-2)",
                    }}
                  />
                </label>

                {selectedFile && (
                  <p style={{ marginTop: "var(--space-2)" }}>
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div style={{ marginTop: "var(--space-4)" }}>
                <label>
                  <strong>Feedback</strong>

                  <textarea
                    value={feedback}
                    onChange={(event) =>
                      handleFeedbackChange(submission.id, event.target.value)
                    }
                    disabled={isUploading}
                    rows={4}
                    placeholder="Write feedback for the student..."
                    style={{
                      display: "block",
                      width: "100%",
                      marginTop: "var(--space-2)",
                      padding: "var(--space-3)",
                      resize: "vertical",
                    }}
                  />
                </label>
              </div>

              <div style={{ marginTop: "var(--space-4)" }}>
                <button
                  type="button"
                  className="admin-action-button admin-action-button--primary"
                  onClick={() =>
                    handleUploadCorrection(
                      submission.assignment.id,
                      submission.id,
                    )
                  }
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload correction"}
                </button>
              </div>

              {uploadSucceeded && (
                <p
                  style={{
                    marginTop: "var(--space-3)",
                    color: "var(--success)",
                  }}
                >
                  Correction uploaded successfully.
                </p>
              )}

              {uploadCorrectedFile.isError &&
                uploadCorrectedFile.variables?.submissionId ===
                  submission.id && (
                  <p
                    style={{
                      marginTop: "var(--space-3)",
                      color: "var(--danger)",
                    }}
                  >
                    Failed to upload correction.
                  </p>
                )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function TeacherDashboardPage() {
  const { data: courses, isLoading, isError, error } = useMyCourses();

  const [openedStudentId, setOpenedStudentId] = useState<number | null>(null);

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
            Manage your courses, students, and assignments.
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
                <div>
                  {course.enrollments.map(({ user }) => {
                    const isOpen = openedStudentId === user.id;

                    return (
                      <div
                        key={user.id}
                        style={{
                          marginTop: "var(--space-4)",
                          padding: "var(--space-3)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "var(--space-3)",
                          }}
                        >
                          <div>
                            <strong>{user.name}</strong>

                            <p>{user.email}</p>
                          </div>

                          <button
                            type="button"
                            className="admin-action-button admin-action-button--primary"
                            onClick={() =>
                              setOpenedStudentId(isOpen ? null : user.id)
                            }
                          >
                            {isOpen ? "Hide assignments" : "View assignments"}
                          </button>
                        </div>

                        {isOpen && (
                          <div style={{ marginTop: "var(--space-4)" }}>
                            <StudentSubmissions studentId={user.id} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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
