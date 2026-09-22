import {
  useId,
  useState,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import "./ui.css";
import "./ui.css";

// A labelled text input. Pass `label`, and optionally `error` (a message shown in
// red) or `hint` (grey helper text). useId() gives a unique id so the <label>
// is correctly linked to the <input> (good for accessibility).

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className = "",
  type,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>

      <div className={isPassword ? "input-password-wrapper" : undefined}>
        <input
          id={inputId}
          type={inputType}
          className={`input ${isPassword ? "input--password" : ""} ${
            error ? "input--invalid" : ""
          } ${className}`}
          aria-invalid={error ? true : undefined}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Visible password
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              // Hidden password
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3L21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10.5 5.2C11 5.1 11.5 5 12 5C18.5 5 22 12 22 12C22 12 20.5 15 17.5 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.5 7C3.5 9 2 12 2 12C2 12 5.5 19 12 19C13 19 14 18.8 15 18.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}

// Same idea for multi-line text (course description, lesson content).
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className = "",
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className="field">
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <textarea
        id={inputId}
        className={`textarea ${error ? "textarea--invalid" : ""} ${className}`}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
