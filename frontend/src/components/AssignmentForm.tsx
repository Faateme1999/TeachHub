import { useState, type FormEvent } from "react";
import { Input, Textarea } from "./ui/Input";
import { Button } from "./ui/Button";
import type { AssignmentInput } from "../types/api";
import "./components.css";

interface AssignmentFormProps {
  submitLabel: string;
  submitting: boolean;
  serverError?: string;
  onSubmit: (values: AssignmentInput) => void;
  onCancel: () => void;
}

export function AssignmentForm({
  submitLabel,
  submitting,
  serverError,
  onSubmit,
  onCancel,
}: AssignmentFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const [errors, setErrors] = useState<{
    title?: string;
    deadline?: string;
  }>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: typeof errors = {};

    if (!title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!deadline) {
      nextErrors.deadline = "Deadline is required";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      title: title.trim(),
      ...(description.trim() ? { description: description.trim() } : {}),
      deadline: new Date(deadline).toISOString(),
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="form__error">{serverError}</div>}

      <Input
        label="Assignment title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        placeholder="e.g. NestJS first assignment"
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what students should do..."
      />

      <Input
        label="Deadline"
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        error={errors.deadline}
      />

      <div className="form__actions">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>

        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
