import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import type { ReassessmentAnswer } from "../types/api";

interface SubmitReassessmentTestInput {
  testId: number;
  answers: ReassessmentAnswer[];
}

interface SubmitReassessmentTestResponse {
  id: number;
  userId: number;
  testId: number;
  attemptNumber: number;
  score: number;
  submittedAt: string;
}

export function useSubmitReassessmentTest() {
  return useMutation({
    mutationFn: async ({ testId, answers }: SubmitReassessmentTestInput) => {
      const { data } = await apiClient.post<SubmitReassessmentTestResponse>(
        `/missions/tests/${testId}/submit`,
        { answers },
      );

      return data;
    },
  });
}
