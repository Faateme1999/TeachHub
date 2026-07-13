import { useState, type FormEvent } from 'react'
import { Input, Textarea } from './ui/Input'
import { Button } from './ui/Button'
import type { LessonInput } from '../types/api'
import './components.css'

// A small form to add or edit a lesson (title + content). Used inside a modal
// on the course detail page.
interface LessonFormProps {
  initialValue?: LessonInput
  submitLabel: string
  submitting: boolean
  serverError?: string
  onSubmit: (values: LessonInput) => void
  onCancel: () => void
}

export function LessonForm({
  initialValue,
  submitLabel,
  submitting,
  serverError,
  onSubmit,
  onCancel,
}: LessonFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? '')
  const [content, setContent] = useState(initialValue?.content ?? '')
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!title.trim()) nextErrors.title = 'Title is required'
    if (!content.trim()) nextErrors.content = 'Content is required'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ title: title.trim(), content: content.trim() })
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
      <Textarea
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        error={errors.content}
        placeholder="The lesson material…"
      />
      <div className="form__actions">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
