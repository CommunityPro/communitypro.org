import { QueryClient } from "@tanstack/react-query"

const staleTime = 1000 * 60 // 1 minute

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: staleTime,
			refetchOnMount: "always",
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
			retry: 3,
			retryDelay: (attemptIndex: any) => Math.min(1000 * 2 ** attemptIndex, 30000),
		},
	},
})
