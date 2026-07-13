import type { ReactNode } from 'react'
import './ui.css'

// A small rounded label — we use it for the course price and "Enrolled" status.
interface BadgeProps {
  children: ReactNode
  variant?: 'accent' | 'success'
}

export function Badge({ children, variant = 'accent' }: BadgeProps) {
  return <span className={`badge ${variant === 'success' ? 'badge--success' : ''}`}>{children}</span>
}
