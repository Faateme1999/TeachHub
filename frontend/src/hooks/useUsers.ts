import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { queryKeys } from '../lib/queryKeys'
import type { Course, User } from '../types/api'

// Hooks for reading users and their enrolled courses.

// GET /users — list everyone on the platform.
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const { data } = await apiClient.get<User[]>('/users')
      return data
    },
  })
}

// GET /users/:id — one user's public profile.
export function useUser(id: number) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<User>(`/users/${id}`)
      return data
    },
    enabled: Number.isFinite(id),
  })
}

// GET /users/:id/courses — a specific user's enrolled courses.
//
// HEADS UP: this backend endpoint is currently a STUB and returns 501 Not
// Implemented (a junior task to finish — see docs/junior-dev-tasks.md). We set
// `retry: false` so TanStack doesn't keep retrying a call we know will fail, and
// the profile page handles the error by showing a friendly "coming soon" note.
export function useUserCourses(id: number) {
  return useQuery({
    queryKey: queryKeys.users.courses(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Course[]>(`/users/${id}/courses`)
      return data
    },
    enabled: Number.isFinite(id),
    retry: false,
  })
}

// GET /users/my-profile — the logged-in user's own profile.
export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.me.profile,
    queryFn: async () => {
      const { data } = await apiClient.get<User>('/users/my-profile')
      return data
    },
  })
}

// GET /users/me/courses — the logged-in user's enrolled courses.
export function useMyCourses() {
  return useQuery({
    queryKey: queryKeys.me.courses,
    queryFn: async () => {
      const { data } = await apiClient.get<Course[]>('/users/me/courses')
      return data
    },
  })
}
