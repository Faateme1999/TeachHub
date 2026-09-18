import {
  useDownloadCorrectedSubmission,
  useSubmitAssignment,
} from "../hooks/useAssignments";
import type { Assignment } from "../types/api";
import { Card } from "./ui/Card";

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleString();
}

interface AssignmentCardProps {
  assignment: Assignment;
  isAdmin: boolean;
}

export function AssignmentCard({ assignment, isAdmin }: AssignmentCardProps) {
  const submitMutation = useSubmitAssignment(assignment.id);
  const downloadCorrectedMutation = useDownloadCorrectedSubmission();

  const submission =
    assignment.submissions?.find(
      (submission) => submission.correctedFileName,
    ) ?? assignment.submissions?.[0];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    submitMutation.mutate(file);

    e.target.value = "";
  }

  async function handleDownloadCorrected() {
    if (!submission?.id || !submission.correctedFileName) {
      return;
    }

    const response = await downloadCorrectedMutation.mutateAsync({
      assignmentId: assignment.id,
      submissionId: submission.id,
    });

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = url;
    link.download = submission.correctedFileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <div>
        <h2>{assignment.title}</h2>

        {assignment.description && (
          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "var(--space-2)",
            }}
          >
            {assignment.description}
          </p>
        )}

        <div
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-3)",
            background: "var(--surface-2)",
            borderRadius: "var(--radius)",
          }}
        >
          <strong>Deadline:</strong> {formatDeadline(assignment.deadline)}
        </div>

        {!isAdmin && (
          <>
            <div style={{ marginTop: "var(--space-4)" }}>
              <label>
                <strong>Upload your assignment</strong>

                <input
                  type="file"
                  onChange={handleFileChange}
                  disabled={submitMutation.isPending}
                  style={{
                    display: "block",
                    marginTop: "var(--space-2)",
                  }}
                />
              </label>

              {submitMutation.isPending && (
                <p style={{ marginTop: "var(--space-2)" }}>Uploading...</p>
              )}

              {submitMutation.isSuccess && (
                <p
                  style={{
                    marginTop: "var(--space-2)",
                    color: "var(--success)",
                  }}
                >
                  File uploaded successfully.
                </p>
              )}

              {submitMutation.isError && (
                <p
                  style={{
                    marginTop: "var(--space-2)",
                    color: "var(--danger)",
                  }}
                >
                  Failed to upload file.
                </p>
              )}
            </div>

            {submission && (
              <div
                style={{
                  marginTop: "var(--space-5)",
                  padding: "var(--space-4)",
                  background: "var(--surface-2)",
                  borderRadius: "var(--radius)",
                }}
              >
                <h3>Your submission</h3>

                <p style={{ marginTop: "var(--space-2)" }}>
                  <strong>File:</strong> {submission.fileName}
                </p>

                {submission.correctedFileName && (
                  <div style={{ marginTop: "var(--space-4)" }}>
                    <p>
                      <strong>Corrected file:</strong>{" "}
                      {submission.correctedFileName}
                    </p>

                    <button
                      type="button"
                      onClick={handleDownloadCorrected}
                      disabled={downloadCorrectedMutation.isPending}
                      style={{
                        marginTop: "var(--space-2)",
                      }}
                    >
                      {downloadCorrectedMutation.isPending
                        ? "Downloading..."
                        : "Download corrected file"}
                    </button>
                  </div>
                )}

                {submission.feedback && (
                  <div style={{ marginTop: "var(--space-4)" }}>
                    <strong>Teacher feedback:</strong>

                    <p
                      style={{
                        marginTop: "var(--space-2)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {submission.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
