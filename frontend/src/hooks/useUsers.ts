import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { queryKeys } from '../lib/queryKeys'
import type {
  Course,
  CreateAdminInput,
  RegisterResponse,
  User,
} from '../types/api'

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

// POST /auth/admins — create another admin. ADMIN-only on the backend (guarded by
// @Roles(ADMIN)); the UI only exposes it inside the admin section.
//
// TODO(junior) — US-039 (create admin): this hook is ready to use as-is. Call it
// from CreateAdminPage:
//   const createAdmin = useCreateAdmin()
//   createAdmin.mutate({ name, email, password }, { onSuccess, onError })
// Note: the backend AuthService.createAdmin is itself a stub (returns 501) until
// you implement it — so this call will 501 until then. See auth.service.ts.
export function useCreateAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateAdminInput) => {
      const { data } = await apiClient.post<RegisterResponse>('/auth/admins', input)
      return data
    },
    onSuccess: () => {
      // The user list changed — refresh it so the new admin appears.
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    },
  })
}
