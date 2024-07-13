import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClientProvider } from "@tanstack/react-query"
import type { AppProps } from "next/app"

import { SSRProvider } from "@/components/provider"
import { queryClient } from "@/utils"
import "../styles/index.scss"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<SSRProvider>
				<Component {...pageProps} />
			</SSRProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	)
}
