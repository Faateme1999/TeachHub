import type { HTMLAttributes, ReactNode } from 'react'
import './ui.css'

// A simple white "card" surface. Use it to group related content with a border,
// rounded corners, and a subtle shadow.
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  )
}
