import { useEffect, type ReactNode } from 'react'
import './ui.css'

// A basic modal dialog: a centered box over a dark backdrop.
// - Clicking the backdrop or pressing Escape closes it (calls onClose).
// - We stop clicks inside the box from bubbling up to the backdrop.
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  // Close on Escape key while the modal is open.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="modal__title">{title}</h3>}
        {children}
      </div>
    </div>
  )
}
