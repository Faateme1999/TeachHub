// Query keys are the "labels" TanStack Query uses to cache data.
// Two requests with the same key share the same cache entry, and we use these
// keys to invalidate (refetch) data after a change — e.g. after creating a
// course we invalidate `queryKeys.courses.all` so the list refreshes.
//
// Keeping them in one file avoids typos like ['course'] vs ['courses'].

export const queryKeys = {
  courses: {
    all: ["courses"] as const,
    detail: (id: number) => ["courses", id] as const,
    lessons: (courseId: number) => ["courses", courseId, "lessons"] as const,
  },
  lessons: {
    detail: (id: number) => ["lessons", id] as const,
    outcomes: (lessonId: number) => ["lessons", lessonId, "outcomes"] as const,
  },
  outcomes: {
    missions: (outcomeId: number) =>
      ["outcomes", outcomeId, "missions"] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: number) => ["users", id] as const,
    courses: (id: number) => ["users", id, "courses"] as const,
  },
  me: {
    profile: ["me", "profile"] as const,
    courses: ["me", "courses"] as const,
  },
};
