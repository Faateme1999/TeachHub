import { useCallback, useRef, useState, type ReactNode } from 'react'
import {
  ToastContext,
  type Toast,
  type ToastContextValue,
  type ToastVariant,
} from './toast-context'
import './ui.css'

// Renders toasts in the bottom-right corner and provides showToast() to the app.
// Each toast auto-dismisses after a few seconds.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  // A ref counter gives each toast a unique id without needing Date.now().
  const nextId = useRef(0)

  const showToast = useCallback((message: string, variant: ToastVariant = 'default') => {
    const id = nextId.current++
    setToasts((current) => [...current, { id, message, variant }])
    // Remove it automatically after 3.5 seconds.
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const value: ToastContextValue = { showToast }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.variant === 'success' ? 'toast--success' : ''} ${
              toast.variant === 'error' ? 'toast--error' : ''
            }`}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
