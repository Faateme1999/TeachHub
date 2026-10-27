import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import type { ReassessmentTest } from "../types/api";

export function useGenerateReassessmentTest() {
  return useMutation({
    mutationFn: async (lessonId: number) => {
      const { data } = await apiClient.post<ReassessmentTest>(
        `/missions/lessons/${lessonId}/reassessment-test`,
      );

      return data;
    },
  });
}
