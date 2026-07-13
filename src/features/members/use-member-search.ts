import { useQuery } from "@tanstack/react-query";

import { membersKeys, type MembersListFilters } from "@/lib/query/keys";
import type { MemberSearchResult } from "./search-api";
import { searchMembers } from "./search-api";

/**
 * Searches the members directory against the given filters (text, skills, experience,
 * pagination), backed by `searchMembers` (Meilisearch when available, DB fallback
 * otherwise). Keeps the previous page's data visible while a new query is in flight so
 * the results grid doesn't flash empty while the visitor is typing or changing filters.
 *
 * @param filters - The current directory filters, keyed the same way as `membersKeys.list`.
 * @returns A React Query result whose `data` is a `MemberSearchResult`.
 * @example
 * const { data, isFetching } = useMemberSearch({ search: "react", page: 1, pageSize: 12 });
 */
export const useMemberSearch = (filters: MembersListFilters) =>
  useQuery<MemberSearchResult>({
    queryKey: membersKeys.list(filters),
    queryFn: () =>
      searchMembers({
        query: filters.search,
        skills: filters.skills,
        experience: filters.experience,
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 12,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });
