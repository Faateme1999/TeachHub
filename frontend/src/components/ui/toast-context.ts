import { createContext, useContext } from 'react'

// A "toast" is a small message that pops up in the corner (e.g. "Enrolled!").
// This file defines the toast types + the hook to trigger one from anywhere.
// The <ToastProvider> that actually renders them lives in ToastProvider.tsx.

export type ToastVariant = 'default' | 'success' | 'error'

export interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

export interface ToastContextValue {
  // Call this to show a toast: showToast('Saved!', 'success')
  showToast: (message: string, variant?: ToastVariant) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>')
  }
  return context
}
