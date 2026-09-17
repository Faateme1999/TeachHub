import { useSubmitAssignment } from "../hooks/useAssignments";
import type { Assignment } from "../types/api";
import { Card } from "./ui/Card";

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleString();
}

export function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const submitMutation = useSubmitAssignment(assignment.id);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    submitMutation.mutate(file);

    e.target.value = "";
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
      </div>
    </Card>
  );
}
