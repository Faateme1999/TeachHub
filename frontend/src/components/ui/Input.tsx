import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import './ui.css'

// A labelled text input. Pass `label`, and optionally `error` (a message shown in
// red) or `hint` (grey helper text). useId() gives a unique id so the <label>
// is correctly linked to the <input> (good for accessibility).

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, id, className = '', ...rest }: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={`input ${error ? 'input--invalid' : ''} ${className}`}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}

// Same idea for multi-line text (course description, lesson content).
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, id, className = '', ...rest }: TextareaProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <textarea
        id={inputId}
        className={`textarea ${error ? 'textarea--invalid' : ''} ${className}`}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}
