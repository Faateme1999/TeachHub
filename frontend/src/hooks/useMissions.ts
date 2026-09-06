import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { apiClient } from "../lib/apiClient";
import type { Mission } from "../types/api";

// GET /outcomes/:outcomeId/missions
export function useMissionsByOutcome(outcomeId: number) {
  return useQuery({
    queryKey: queryKeys.outcomes.missions(outcomeId),
    queryFn: async () => {
      const { data } = await apiClient.get<Mission[]>(
        `/outcomes/${outcomeId}/missions`,
      );
      return data;
    },
    enabled: Number.isFinite(outcomeId) && outcomeId > 0,
  });
}
