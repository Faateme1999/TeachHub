import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { queryKeys } from "../lib/queryKeys";
import type { Assignment, AssignmentInput } from "../types/api";

export function useAssignments(lessonId: number) {
  return useQuery({
    queryKey: queryKeys.lessons.assignments(lessonId),

    queryFn: async () => {
      const { data } = await apiClient.get<Assignment[]>(
        `/lessons/${lessonId}/assignments`,
      );

      return data;
    },

    enabled: lessonId > 0,
  });
}

export function useCreateAssignment(lessonId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AssignmentInput) => {
      const { data } = await apiClient.post<Assignment>(
        `/lessons/${lessonId}/assignments`,
        input,
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.assignments(lessonId),
      });
    },
  });
}

export function useSubmitAssignment(assignmentId: number) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await apiClient.post(
        `/assignments/${assignmentId}/submissions`,
        formData,
      );

      return data;
    },
  });
}

export function useDownloadSubmission() {
  return useMutation({
    mutationFn: async ({
      assignmentId,
      submissionId,
    }: {
      assignmentId: number;
      submissionId: number;
    }) => {
      const response = await apiClient.get(
        `/assignments/${assignmentId}/submissions/${submissionId}/download`,
        {
          responseType: "blob",
        },
      );

      return response;
    },
  });
}

export function useDownloadCorrectedSubmission() {
  return useMutation({
    mutationFn: async ({
      assignmentId,
      submissionId,
    }: {
      assignmentId: number;
      submissionId: number;
    }) => {
      const response = await apiClient.get(
        `/assignments/${assignmentId}/submissions/${submissionId}/corrected-download`,
        {
          responseType: "blob",
        },
      );

      return response;
    },
  });
}
