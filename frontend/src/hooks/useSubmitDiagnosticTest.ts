import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import type {
  SubmitDiagnosticAnswer,
  SubmitDiagnosticTestResponse,
} from "../types/api";

export function useSubmitDiagnosticTest() {
  return useMutation({
    mutationFn: async ({
      testId,
      answers,
    }: {
      testId: number;
      answers: SubmitDiagnosticAnswer[];
    }) => {
      const { data } = await apiClient.post<SubmitDiagnosticTestResponse>(
        `/missions/diagnostic-tests/${testId}/submit`,
        { answers },
      );

      return data;
    },
  });
}
