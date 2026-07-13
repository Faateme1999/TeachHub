import { createContext, useContext } from 'react'
import type { User } from '../types/api'

// This file holds the "shape" of our auth state and the hook to read it.
// The actual <AuthProvider> component lives in AuthProvider.tsx.
//
// Why split them? A React fast-refresh / lint rule (only-export-components)
// prefers a file to export EITHER components OR plain values — not both. Putting
// the context object + hook here (plain values) and the provider there (a
// component) keeps everything tidy and warning-free.

export interface AuthContextValue {
  user: User | null
  token: string | null
  // true only when we have a valid token
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// `undefined` default lets us detect "used outside the provider" (see the hook).
export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// The hook every component uses to read auth state: `const { user } = useAuth()`.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}
