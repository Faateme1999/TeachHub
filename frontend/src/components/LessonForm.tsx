import { useState, type FormEvent } from "react";
import { Input, Textarea } from "./ui/Input";
import { Button } from "./ui/Button";
import type { LessonInput, LessonType } from "../types/api";
import "./components.css";

interface LessonFormProps {
  initialValue?: LessonInput;
  submitLabel: string;
  submitting: boolean;
  serverError?: string;
  onSubmit: (values: LessonInput) => void;
  onCancel: () => void;
}

export function LessonForm({
  initialValue,
  submitLabel,
  submitting,
  serverError,
  onSubmit,
  onCancel,
}: LessonFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? "");

  const [type, setType] = useState<LessonType>(
    initialValue?.type ?? "RECORDED",
  );

  const [content, setContent] = useState(initialValue?.content ?? "");

  const [video, setVideo] = useState<File | undefined>(initialValue?.video);

  const [meetingUrl, setMeetingUrl] = useState(initialValue?.meetingUrl ?? "");

  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    video?: string;
    meetingUrl?: string;
  }>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: typeof errors = {};

    if (!title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (type === "RECORDED" && !content.trim() && !video) {
      nextErrors.content = "At least one of content or video is required";
    }

    if (type === "LIVE" && !meetingUrl.trim()) {
      nextErrors.meetingUrl = "Meeting URL is required for live lessons";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      title: title.trim(),
      type,

      ...(content.trim() ? { content: content.trim() } : {}),

      ...(video ? { video } : {}),

      ...(meetingUrl.trim() ? { meetingUrl: meetingUrl.trim() } : {}),
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="form__error">{serverError}</div>}

      <Input
        label="Lesson title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        placeholder="e.g. Setting up your first module"
      />

      <div className="form__field">
        <label htmlFor="lesson-type">Lesson type</label>

        <select
          id="lesson-type"
          value={type}
          onChange={(e) => {
            const newType = e.target.value as LessonType;

            setType(newType);
            setErrors({});
          }}
          disabled={submitting}
        >
          <option value="RECORDED">Recorded</option>
          <option value="LIVE">Live</option>
        </select>
      </div>

      <Textarea
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={errors.content}
        placeholder="The lesson material…"
      />

      <div className="form__field">
        <label htmlFor="lesson-video">Video</label>

        <input
          id="lesson-video"
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];

            setVideo(file);
            setErrors((current) => ({
              ...current,
              video: undefined,
            }));
          }}
          disabled={submitting}
        />

        {video && <small>Selected: {video.name}</small>}

        {errors.video && <div className="form__error">{errors.video}</div>}
      </div>

      {type === "LIVE" && (
        <Input
          label="Meeting URL"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
          error={errors.meetingUrl}
          placeholder="https://..."
        />
      )}

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
