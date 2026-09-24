import { useState } from "react";
import {
  useOutcomes,
  useCreateOutcome,
  useUpdateOutcome,
  useDeleteOutcome,
} from "../hooks/useOutcomes";
import { apiClient, getApiErrorMessage } from "../lib/apiClient";
import { useToast } from "./ui/toast-context";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Spinner";
import { ErrorState } from "./ui/States";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import type { AssignmentInput, Lesson, Outcome } from "../types/api";
import { useMissionsByOutcome } from "../hooks/useMissions";
import { Link } from "react-router-dom";
import { useCreateAssignment } from "../hooks/useAssignments";
import { AssignmentForm } from "./AssignmentForm";
import { Modal } from "./ui/Modal";

interface LessonItemProps {
  lesson: Lesson;
  index: number;
  isAdmin: boolean;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

export function LessonItem({
  lesson,
  index,
  isAdmin,
  onEdit,
  onDelete,
}: LessonItemProps) {
  const { showToast } = useToast();

  const outcomesQuery = useOutcomes(lesson.id);
  const createOutcome = useCreateOutcome(lesson.id);
  const updateOutcome = useUpdateOutcome();
  const deleteOutcome = useDeleteOutcome();

  const [newOutcomeText, setNewOutcomeText] = useState("");
  const [editingOutcome, setEditingOutcome] = useState<Outcome | null>(null);
  const [editOutcomeText, setEditOutcomeText] = useState("");
  const [outcomeToDelete, setOutcomeToDelete] = useState<Outcome | null>(null);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<number | null>(
    null,
  );

  const missionsQuery = useMissionsByOutcome(selectedOutcomeId ?? 0);
  const missions = missionsQuery.data ?? [];

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | undefined>();
  const createAssignment = useCreateAssignment(lesson.id);

  function handleCreateOutcome() {
    const text = newOutcomeText.trim();

    if (text.length < 5) {
      showToast("Outcome must be at least 5 characters.", "error");
      return;
    }

    createOutcome.mutate(
      { text },
      {
        onSuccess: () => {
          setNewOutcomeText("");
          showToast("Outcome added", "success");
        },
        onError: (err) => {
          showToast(getApiErrorMessage(err, "Could not add outcome"), "error");
        },
      },
    );
  }

  function handleUpdateOutcome() {
    if (!editingOutcome) return;

    const text = editOutcomeText.trim();

    if (text.length < 5) {
      showToast("Outcome must be at least 5 characters.", "error");
      return;
    }

    updateOutcome.mutate(
      {
        lessonId: lesson.id,
        outcomeId: editingOutcome.id,
        input: { text },
      },
      {
        onSuccess: () => {
          setEditingOutcome(null);
          setEditOutcomeText("");
          showToast("Outcome updated", "success");
        },
        onError: (err) => {
          showToast(
            getApiErrorMessage(err, "Could not update outcome"),
            "error",
          );
        },
      },
    );
  }

  function handleDeleteOutcome() {
    if (!outcomeToDelete) return;

    deleteOutcome.mutate(
      {
        lessonId: lesson.id,
        outcomeId: outcomeToDelete.id,
      },
      {
        onSuccess: () => {
          setOutcomeToDelete(null);
          showToast("Outcome deleted", "success");
        },
        onError: (err) => {
          showToast(
            getApiErrorMessage(err, "Could not delete outcome"),
            "error",
          );
          setOutcomeToDelete(null);
        },
      },
    );
  }

  const outcomes = outcomesQuery.data ?? [];

  function openAddAssignment() {
    setAssignmentError(undefined);
    setAssignmentModalOpen(true);
  }

  function handleAssignmentSubmit(values: AssignmentInput) {
    createAssignment.mutate(values, {
      onSuccess: () => {
        setAssignmentModalOpen(false);
        setAssignmentError(undefined);
        showToast("Assignment added");
      },
      onError: (error) => {
        setAssignmentError(
          getApiErrorMessage(error, "Could not add assignment"),
        );
      },
    });
  }

  return (
    <Card className="lesson-item">
      <div className="lesson-item__body">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <p className="lesson-item__title">
            {index + 1}. {lesson.title}
          </p>

          <span
            style={{
              fontSize: "12px",
              padding: "3px 8px",
              borderRadius: "999px",
              border: "1px solid #ccc",
            }}
          >
            {lesson.type === "RECORDED" ? "Recorded" : "Live"}
          </span>
        </div>

        {lesson.content && (
          <p className="lesson-item__content">{lesson.content}</p>
        )}

        {lesson.hasVideo && (
          <video
            controls
            style={{
              width: "100%",
              maxWidth: "800px",
              marginTop: "12px",
              borderRadius: "12px",
            }}
            src={`${apiClient.defaults.baseURL}/lessons/${lesson.id}/video`}
          >
            Your browser does not support the video tag.
          </video>
        )}

        {lesson.type === "LIVE" && lesson.meetingUrl && (
          <p className="lesson-item__content">
            <a
              href={lesson.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔴 Join live lesson
            </a>
          </p>
        )}

        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to={`/courses/${lesson.courseId}/lessons/${lesson.id}/assignments`}
          >
            <Button variant="secondary" size="sm">
              Assignments
            </Button>
          </Link>

          {isAdmin && (
            <Button size="sm" onClick={openAddAssignment}>
              + Add assignment
            </Button>
          )}
        </div>

        <div style={{ marginTop: "var(--space-3)" }}>
          <h3>Learning outcomes</h3>

          {outcomesQuery.isLoading && <Spinner center />}

          {outcomesQuery.isError && (
            <ErrorState message="Could not load outcomes." />
          )}

          {!outcomesQuery.isLoading && outcomes.length === 0 && (
            <p>No outcomes yet.</p>
          )}

          {outcomes.length > 0 && (
            <ul>
              {outcomes.map((outcome) => (
                <li key={outcome.id}>
                  {editingOutcome?.id === outcome.id ? (
                    <div>
                      <input
                        value={editOutcomeText}
                        onChange={(event) =>
                          setEditOutcomeText(event.target.value)
                        }
                      />

                      <Button
                        size="sm"
                        onClick={handleUpdateOutcome}
                        disabled={updateOutcome.isPending}
                      >
                        {updateOutcome.isPending ? "Saving…" : "Save"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingOutcome(null);
                          setEditOutcomeText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedOutcomeId(
                            selectedOutcomeId === outcome.id
                              ? null
                              : outcome.id,
                          )
                        }
                      >
                        {outcome.text}
                      </button>

                      {isAdmin && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingOutcome(outcome);
                              setEditOutcomeText(outcome.text);
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOutcomeToDelete(outcome)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {selectedOutcomeId === outcome.id && (
                    <div style={{ marginLeft: "24px", marginTop: "8px" }}>
                      {missionsQuery.isLoading && <Spinner />}

                      {missionsQuery.isError && (
                        <ErrorState message="Could not load missions." />
                      )}

                      {!missionsQuery.isLoading && missions.length === 0 && (
                        <p>No missions yet.</p>
                      )}

                      {missions.length > 0 && (
                        <ul>
                          {missions.map((mission) => (
                            <li key={mission.id}>
                              <Link to={`/missions/${mission.id}/questions`}>
                                {mission.order}. {mission.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {isAdmin && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <input
                value={newOutcomeText}
                onChange={(event) => setNewOutcomeText(event.target.value)}
                placeholder="Add a learning outcome..."
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                }}
              />

              <Button
                size="sm"
                onClick={handleCreateOutcome}
                disabled={createOutcome.isPending}
              >
                {createOutcome.isPending ? "Adding…" : "+ Add learning outcome"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="lesson-item__actions">
          <Button variant="ghost" size="sm" onClick={() => onEdit(lesson)}>
            Edit
          </Button>

          <Button variant="ghost" size="sm" onClick={() => onDelete(lesson)}>
            Delete
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={outcomeToDelete !== null}
        title="Delete outcome?"
        message={`Remove "${outcomeToDelete?.text}"?`}
        loading={deleteOutcome.isPending}
        onConfirm={handleDeleteOutcome}
        onCancel={() => setOutcomeToDelete(null)}
      />

      <Modal
        open={assignmentModalOpen}
        title="Add assignment"
        onClose={() => {
          if (!createAssignment.isPending) {
            setAssignmentModalOpen(false);
          }
        }}
      >
        <AssignmentForm
          submitLabel="Add assignment"
          submitting={createAssignment.isPending}
          serverError={assignmentError}
          onSubmit={handleAssignmentSubmit}
          onCancel={() => setAssignmentModalOpen(false)}
        />
      </Modal>
    </Card>
  );
}
