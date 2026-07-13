import axios, { type InternalAxiosRequestConfig } from 'axios'

// A single, shared axios instance for talking to the backend.
// Every request in the app goes through this so we can add the auth token and
// handle errors in ONE place instead of repeating it everywhere.

// Where the token lives in the browser. Exported so AuthContext uses the same key.
export const TOKEN_STORAGE_KEY = 'teachhub_token'

export const apiClient = axios.create({
  // "/api" is handled by the Vite dev proxy (see vite.config.ts), which forwards
  // to http://localhost:3000. In production you'd point VITE_API_URL at the API.
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

// --- Request interceptor -------------------------------------------------
// Runs before every request leaves the browser. If we have a saved token,
// attach it as "Authorization: Bearer <token>" so protected routes accept us.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Response interceptor ------------------------------------------------
// Runs after every response. If the server says 401 (token missing/expired),
// we clear the bad token and send the user to the login page.
//
// Important details:
//  - We do NOT redirect if the failing call was the login request itself, so a
//    "wrong password" 401 shows an inline error instead of reloading the page.
//  - We do NOT redirect if we're already on /login (avoids a redirect loop).
//  - Only 401 triggers this. Other errors (like 501 from the not-yet-built
//    "user courses" endpoint) are passed through so pages can handle them.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl: string = error.config?.url ?? ''
    const isLoginRequest = requestUrl.includes('/auth/login')
    const alreadyOnLogin = window.location.pathname === '/login'

    if (status === 401 && !isLoginRequest && !alreadyOnLogin) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      window.location.assign('/login')
    }

    // Re-throw so the calling code (TanStack Query) still sees the error.
    return Promise.reject(error)
  },
)

// Helper to pull a human-readable message out of an axios error.
// The backend sends { message: "..." } (or an array of messages from validation).
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined
    const message = data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (typeof message === 'string') return message
  }
  return fallback
}
