import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import type { Outcome, OutcomeInput } from "../types/api";

// GET /lessons/:lessonId/outcomes
export function useOutcomes(lessonId: number) {
  return useQuery({
    queryKey: queryKeys.lessons.outcomes(lessonId),
    queryFn: async () => {
      const { data } = await apiClient.get<Outcome[]>(
        `/lessons/${lessonId}/outcomes`,
      );
      return data;
    },
    enabled: Number.isFinite(lessonId),
  });
}

// POST /lessons/:lessonId/outcomes
export function useCreateOutcome(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: OutcomeInput) => {
      const { data } = await apiClient.post<Outcome>(
        `/lessons/${lessonId}/outcomes`,
        input,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.outcomes(lessonId),
      });
    },
  });
}

// PATCH /lessons/:lessonId/outcomes/:outcomeId
export function useUpdateOutcome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lessonId,
      outcomeId,
      input,
    }: {
      lessonId: number;
      outcomeId: number;
      input: OutcomeInput;
    }) => {
      const { data } = await apiClient.patch<Outcome>(
        `/lessons/${lessonId}/outcomes/${outcomeId}`,
        input,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.outcomes(variables.lessonId),
      });
    },
  });
}

// DELETE /lessons/:lessonId/outcomes/:outcomeId
export function useDeleteOutcome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lessonId,
      outcomeId,
    }: {
      lessonId: number;
      outcomeId: number;
    }) => {
      await apiClient.delete(`/lessons/${lessonId}/outcomes/${outcomeId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.outcomes(variables.lessonId),
      });
    },
  });
}
