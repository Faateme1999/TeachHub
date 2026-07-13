import { useState, type FormEvent } from 'react'
import { Input, Textarea } from './ui/Input'
import { Button } from './ui/Button'
import type { CourseInput } from '../types/api'
import './components.css'

// A reusable form for BOTH creating and editing a course.
// - `initialValue` pre-fills the fields (used when editing).
// - `onSubmit` is called with the validated values.
// - `submitting` / `serverError` are passed in by the page so we can show a
//   loading button and any error the backend returned.
interface CourseFormProps {
  initialValue?: CourseInput
  submitLabel: string
  submitting: boolean
  serverError?: string
  onSubmit: (values: CourseInput) => void
  onCancel: () => void
}

export function CourseForm({
  initialValue,
  submitLabel,
  submitting,
  serverError,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? '')
  const [description, setDescription] = useState(initialValue?.description ?? '')
  // Keep price as a string in the input; convert to a number on submit.
  const [price, setPrice] = useState(
    initialValue ? String(initialValue.price) : '',
  )
  const [errors, setErrors] = useState<{ title?: string; description?: string; price?: string }>({})

  function validate(): CourseInput | null {
    const nextErrors: typeof errors = {}
    if (!title.trim()) nextErrors.title = 'Title is required'
    if (!description.trim()) nextErrors.description = 'Description is required'

    const priceNumber = Number(price)
    if (price.trim() === '' || Number.isNaN(priceNumber)) {
      nextErrors.price = 'Enter a valid price'
    } else if (priceNumber < 0) {
      nextErrors.price = 'Price cannot be negative'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return null
    return { title: title.trim(), description: description.trim(), price: priceNumber }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const values = validate()
    if (values) onSubmit(values)
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="form__error">{serverError}</div>}
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        placeholder="e.g. Intro to NestJS"
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        placeholder="What will students learn?"
      />
      <Input
        label="Price (USD)"
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        error={errors.price}
        hint="Use 0 for a free course"
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
