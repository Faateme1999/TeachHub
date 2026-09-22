import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUser, useUserSubmissions } from "../../hooks/useUsers";
import {
  useDownloadSubmission,
  useUploadCorrectedFile,
} from "../../hooks/useAssignments";

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
          {submissions.map((submission) => {
            const selectedFile = selectedFiles[submission.id] ?? null;

            const feedback = feedbacks[submission.id] ?? "";

            const isUploading =
              uploadCorrectedFile.isPending &&
              uploadCorrectedFile.variables?.submissionId === submission.id;

            const uploadSucceeded = uploadedSubmissionId === submission.id;

            return (
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
                  <h3>Correct this assignment</h3>

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
                      <p
                        style={{
                          marginTop: "var(--space-2)",
                        }}
                      >
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
                          handleFeedbackChange(
                            submission.id,
                            event.target.value,
                          )
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
      )}
    </div>
  );
}
