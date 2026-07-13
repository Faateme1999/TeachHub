import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/auth-context'

// The opposite of ProtectedRoute: wrap pages that only make sense when you're
// NOT logged in (login, register). If you're already logged in, we send you to
// the courses page instead of showing a login form again.
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to="/courses" replace />
  }
  return <>{children}</>
}
