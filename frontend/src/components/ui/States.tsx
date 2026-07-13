import type { ReactNode } from 'react'
import './ui.css'

// Two friendly "placeholder" blocks used across the app:
//  - <EmptyState> when there's simply no data yet (e.g. no courses).
//  - <ErrorState> when a request failed.
// Keeping them here means every page shows the same, consistent messaging.

interface EmptyStateProps {
  icon?: string
  title: string
  message?: string
  action?: ReactNode
}

export function EmptyState({ icon = '📭', title, message, action }: EmptyStateProps) {
  return (
    <div className="state">
      <div className="state__icon" aria-hidden="true">
        {icon}
      </div>
      <p className="state__title">{title}</p>
      {message && <p>{message}</p>}
      {action && <div style={{ marginTop: 'var(--space-4)' }}>{action}</div>}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  action?: ReactNode
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon" aria-hidden="true">
        ⚠️
      </div>
      <p className="state__title">{title}</p>
      {message && <p>{message}</p>}
      {action && <div style={{ marginTop: 'var(--space-4)' }}>{action}</div>}
    </div>
  )
}
