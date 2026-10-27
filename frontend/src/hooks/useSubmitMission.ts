import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import type { SubmitMissionResponse } from "../types/api";

export function useSubmitMission() {
  return useMutation({
    mutationFn: async ({
      missionId,
      answers,
    }: {
      missionId: number;
      answers: {
        questionId: number;
        optionIds: number[];
      }[];
    }) => {
      const { data } = await apiClient.post<SubmitMissionResponse>(
        `/missions/${missionId}/submit`,
        { answers },
      );

      return data;
    },
  });
}
