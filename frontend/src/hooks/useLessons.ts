import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import type { Lesson, LessonInput } from "../types/api";

// Hooks for a course's lessons. The course-detail page uses these alongside
// useCourse() — the backend's course detail doesn't include lessons yet, so we
// fetch them here with a separate request.

// GET /courses/:courseId/lessons — all lessons in a course.
export function useLessons(courseId: number) {
  return useQuery({
    queryKey: queryKeys.courses.lessons(courseId),
    queryFn: async () => {
      const { data } = await apiClient.get<Lesson[]>(
        `/courses/${courseId}/lessons`,
      );
      return data;
    },
    enabled: Number.isFinite(courseId),
  });
}

// POST /courses/:courseId/lessons — add a lesson (requires login).
export function useCreateLesson(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: LessonInput) => {
      const formData = new FormData();

      formData.append("title", input.title);
      formData.append("type", input.type);

      if (input.content) {
        formData.append("content", input.content);
      }

      if (input.meetingUrl) {
        formData.append("meetingUrl", input.meetingUrl);
      }

      if (input.video) {
        formData.append("video", input.video);
      }

      const { data } = await apiClient.post<Lesson>(
        `/courses/${courseId}/lessons`,
        formData,
      );

      return data;
    },
    onSuccess: () => {
      // This course's lesson list is now stale — refetch it.
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.lessons(courseId),
      });
    },
  });
}

// PATCH /lessons/:id — update a lesson (requires login).
// We pass courseId too so we know which lesson list to refresh afterwards.
export function useUpdateLesson(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: LessonInput }) => {
      const formData = new FormData();

      formData.append("title", input.title);
      formData.append("type", input.type);

      if (input.content) {
        formData.append("content", input.content);
      }

      if (input.meetingUrl) {
        formData.append("meetingUrl", input.meetingUrl);
      }

      if (input.video) {
        formData.append("video", input.video);
      }

      const { data } = await apiClient.patch<Lesson>(
        `/lessons/${id}`,
        formData,
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.lessons(courseId),
      });
    },
  });
}

// DELETE /lessons/:id — delete a lesson (requires login).
export function useDeleteLesson(courseId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/lessons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.lessons(courseId),
      });
    },
  });
}
