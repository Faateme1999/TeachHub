import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import type { Question } from "../types/api";

// GET /missions/:missionId/questions
export function useQuestionsByMission(missionId: number) {
  return useQuery({
    queryKey: queryKeys.questions.byMission(missionId),
    queryFn: async () => {
      const { data } = await apiClient.get<Question[]>(
        `/missions/${missionId}/questions`,
      );
      return data;
    },
    enabled: Number.isFinite(missionId) && missionId > 0,
  });
}
