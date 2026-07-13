import { useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { apiClient, TOKEN_STORAGE_KEY } from '../lib/apiClient'
import { AuthContext, type AuthContextValue } from './auth-context'
import type { User, LoginResponse } from '../types/api'

const USER_STORAGE_KEY = 'teachhub_user'

// Read the saved user from localStorage once, when the app first loads.
// We do this in a plain function (used by useState below) instead of a
// useEffect, so the value is ready on the very first render and doesn't flicker.
function readStoredUser(): User | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

interface AuthProviderProps {
  children: ReactNode
}

// <AuthProvider> wraps the app and gives every component access to:
//   - who is logged in (user, token)
//   - login / register / logout actions
export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize state straight from localStorage so a refresh keeps you logged in.
  const [user, setUser] = useState<User | null>(readStoredUser)
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  )

  const queryClient = useQueryClient()

  // Save the token + user in state AND localStorage so it survives a page reload.
  function persistSession(nextToken: string, nextUser: User) {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
    setToken(nextToken)
    setUser(nextUser)
  }

  async function login(email: string, password: string) {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    })
    persistSession(data.accessToken, data.user)
  }

  async function register(name: string, email: string, password: string) {
    // Step 1: create the account. NOTE: the backend's register does NOT return a
    // token, only the new user. So we can't log in from its response alone.
    await apiClient.post('/auth/register', { name, email, password })

    // Step 2: "auto-login" — immediately log in with the same email/password to
    // get a token, so the user lands straight in the app after signing up.
    //
    // We reuse the plaintext password from the form here (that's the only place
    // it exists — the register response never contains it).
    await login(email, password)
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(null)
    setUser(null)
    // Drop all cached data so the next user doesn't see the previous user's data.
    queryClient.clear()
  }

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
