import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 3,
        retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 30_000),
        staleTime: 30_000,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
