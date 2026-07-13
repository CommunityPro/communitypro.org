/** Filters accepted by the members list/grid queries. */
export type MembersListFilters = {
  search?: string;
  skills?: string[];
  experience?: string;
  page?: number;
  pageSize?: number;
};

/**
 * Query key factory for the members feature.
 *
 * Pattern: every feature owns one `<feature>Keys` factory shaped like this one,
 * co-located here (or in `features/<feature>` once the feature grows), so keys stay
 * hierarchical and invalidation can target any level (`all` > `lists` > `list(filters)`).
 *
 * @example
 * useQuery({ queryKey: membersKeys.list({ search: "react" }), queryFn: ... });
 * queryClient.invalidateQueries({ queryKey: membersKeys.all });
 */
export const membersKeys = {
  all: ["members"] as const,
  lists: () => [...membersKeys.all, "list"] as const,
  list: (filters: MembersListFilters) => [...membersKeys.lists(), filters] as const,
  details: () => [...membersKeys.all, "detail"] as const,
  detail: (id: string) => [...membersKeys.details(), id] as const,
  spotlight: () => [...membersKeys.all, "spotlight"] as const,
  me: () => [...membersKeys.all, "me"] as const,
};
