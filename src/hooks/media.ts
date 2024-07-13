import { useCallback, useEffect, useMemo, useState } from "react"

import { MediaQQueryType, MediaQueryType } from "@/types"

export const mediaQueries = (queryType: MediaQueryType = "greaterThanOrEqual") => {
	const breakpoints = {
		xs: "(min-width: 0px)",
		sm: "(min-width: 576px)",
		md: "(min-width: 768px)",
		lg: "(min-width: 992px)",
		xl: "(min-width: 1280px)",
	}

	const reverseBreakpoints = {
		xs: "(max-width: 575.98px)",
		sm: "(max-width: 767.98px)",
		md: "(max-width: 991.98px)",
		lg: "(max-width: 1199.98px)",
		xl: "(max-width: 1280px)",
	}

	const inclusiveBreakpoints = {
		xs: "(min-width: 0px) and (max-width: 575.98px)",
		sm: "(min-width: 576px) and (max-width: 767.98px)",
		md: "(min-width: 768px) and (max-width: 991.98px)",
		lg: "(min-width: 992px) and (max-width: 1199.98px)",
		xl: "(min-width: 1280px)",
	}

	switch (queryType) {
		case "lessThan":
			return breakpoints
		case "greaterThan":
			return reverseBreakpoints
		case "greaterThanOrEqual":
			return inclusiveBreakpoints
		default:
			return {}
	}
}

export function useMediaQuery(
	query: MediaQueryType,
	queryType: MediaQQueryType = "greaterThanOrEqual"
): boolean {
	const mediaQueryList = useMemo(() => {
		return query in mediaQueries(queryType)
			? mediaQueries(queryType)[query as keyof typeof mediaQueries]
			: query
	}, [query, queryType])

	const getMatches = useCallback((): boolean => {
		// Prevents SSR issues
		if (typeof window !== "undefined") {
			return window.matchMedia(mediaQueryList).matches
		}
		return false
	}, [mediaQueryList])

	const [matches, setMatches] = useState<boolean>(getMatches())

	const handleChange = useCallback(() => {
		setMatches(getMatches())
	}, [getMatches])

	useEffect(() => {
		const matchMedia = window.matchMedia(mediaQueryList)

		// Triggered at the first client-side load and if query changes
		handleChange()

		// Listen matchMedia
		if (matchMedia.addListener) {
			matchMedia.addListener(handleChange)
		} else {
			matchMedia.addEventListener("change", handleChange)
		}

		return () => {
			if (matchMedia.removeListener) {
				matchMedia.removeListener(handleChange)
			} else {
				matchMedia.removeEventListener("change", handleChange)
			}
		}
	}, [handleChange, mediaQueryList])

	return matches
}
