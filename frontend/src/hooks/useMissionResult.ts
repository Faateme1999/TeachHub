import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { apiClient } from "../lib/apiClient";

export type MissionResult = {
  id: number;
  passed: boolean;
  bestScore: number;
  attemptsUsed: number;
  userId: number;
  missionId: number;
};

export function useMissionResult(missionId: number) {
  return useQuery({
    queryKey: queryKeys.missions.result(missionId),

    queryFn: async () => {
      const { data } = await apiClient.get<MissionResult | null>(
        `/missions/${missionId}/result`,
      );

      return data;
    },

    enabled: Number.isFinite(missionId) && missionId > 0,
  });
}
