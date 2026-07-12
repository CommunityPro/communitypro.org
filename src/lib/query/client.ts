import { QueryClient } from "@tanstack/react-query";

import { isApiError } from "@/lib/api/errors";

/**
 * Creates the app-wide React Query client with Community Pro defaults:
 * 30s staleTime, no refetch on window focus, up to 2 retries with exponential
 * backoff for transient failures, and no retries for 4xx API errors.
 *
 * @returns A configured `QueryClient` instance.
 * @example
 * const [queryClient] = useState(createQueryClient);
 * return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
 */
export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (isApiError(error) && error.status >= 400 && error.status < 500) return false;
          return failureCount < 2;
        },
        retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 30_000),
      },
      mutations: {
        retry: 0,
      },
    },
  });
