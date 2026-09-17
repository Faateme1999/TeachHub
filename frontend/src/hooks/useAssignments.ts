import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import type { Assignment, AssignmentInput } from "../types/api";

export function useCreateAssignment(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AssignmentInput) => {
      const { data } = await apiClient.post<Assignment>(
        `/lessons/${lessonId}/assignments`,
        input,
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.assignments(lessonId),
      });
    },
  });
}
