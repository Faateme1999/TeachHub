import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import type { DiagnosticWeakness } from "../types/api";

export function useDiagnosticWeaknesses() {
  return useMutation({
    mutationFn: async (testId: number) => {
      const { data } = await apiClient.post<DiagnosticWeakness[]>(
        `/missions/diagnostic-test/${testId}/weaknesses`,
      );

      return data;
    },
  });
}
