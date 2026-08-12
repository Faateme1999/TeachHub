import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import type { Course, CourseInput } from "../types/api";

// This file wraps the "courses" API calls in TanStack Query hooks.
// - useQuery  = read data (with caching, loading & error states for free)
// - useMutation = change data (create/update/delete), then refresh the cache
//
// Components never call axios directly for courses — they use these hooks.

// GET /courses — list every course.
export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses.all,
    queryFn: async () => {
      const { data } = await apiClient.get<Course[]>("/courses");
      return data;
    },
  });
}

// GET /courses/:id — one course's details.
export function useCourse(id: number) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<Course>(`/courses/${id}`);
      return data;
    },
    // Don't run until we actually have a numeric id.
    enabled: Number.isFinite(id),
  });
}

// POST /courses — create a course (requires login).
export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CourseInput) => {
      const { data } = await apiClient.post<Course>("/courses", input);
      return data;
    },
    onSuccess: () => {
      // The list is now stale — tell TanStack to refetch it.
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });
}

// PATCH /courses/:id — update a course (requires login).
export function useUpdateCourse(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CourseInput) => {
      const { data } = await apiClient.patch<Course>(`/courses/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(id) });
    },
  });
}

// DELETE /courses/:id — delete a course (requires login).
export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
  });
}

// POST /courses/:id/enroll — enroll the logged-in user in a course.
export function useEnroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: number) => {
      const { data } = await apiClient.post(`/courses/${courseId}/enroll`);
      return data;
    },
    onSuccess: () => {
      // "My courses" changed, so refresh it.
      queryClient.invalidateQueries({ queryKey: queryKeys.me.courses });
    },
  });
}

// DELETE /courses/:id/enroll — unenroll the logged-in user from a course.
export function useUnenroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: number) => {
      const { data } = await apiClient.delete(`/courses/${courseId}/enroll`);
      return data;
    },
    onSuccess: () => {
      // "My courses" changed, so refresh it.
      queryClient.invalidateQueries({
        queryKey: queryKeys.me.courses,
      });
    },
  });
}
