import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/auth-context'

// Wrap any page that should only be visible to ADMINS (the whole /admin section).
// Two checks:
//   1. Not logged in at all  → send to /login (remember where they were going).
//   2. Logged in but not an admin → send to /courses (they have no business here).
// This is a near-copy of ProtectedRoute with the extra role check.
//
// NOTE: this only HIDES admin UI in the browser. Real security is the backend
// RolesGuard — a student who forges a request still gets 403 from the API.
export function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/courses" replace />
  }

  return <>{children}</>
}
