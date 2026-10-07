import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import type { DiagnosticWeaknessRemediation } from "../types/api";

export function useDiagnosticWeaknesses() {
  return useMutation({
    mutationFn: async (testId: number) => {
      const { data } = await apiClient.post<DiagnosticWeaknessRemediation[]>(
        `/missions/diagnostic-tests/${testId}/weaknesses`,
      );

      return data;
    },
  });
}
