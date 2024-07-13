import { useCallback, useEffect, useRef } from "react"

export const useInterval = (callback: (() => void) | null, delay: unknown) => {
	const savedCallback = useRef<(() => void) | null | React.MutableRefObject<unknown>>(null)
	const intervalId = useRef<NodeJS.Timeout | null | React.MutableRefObject<unknown>>(null)

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback

		return () => {
			savedCallback.current = null
		}
	}, [callback])

	// Set up the interval.
	useEffect(() => {
		const tick = () => {
			if (typeof savedCallback.current === "function") {
				savedCallback.current()
			}
		}

		if (typeof delay === "number") {
			intervalId.current = setInterval(tick, delay)
		}

		return () => {
			if (intervalId.current) {
				clearInterval(intervalId.current as NodeJS.Timeout)
			}
		}
	}, [delay])

	const stopInterval = useCallback(() => {
		savedCallback.current = null
		if (intervalId.current) {
			clearInterval(intervalId.current as NodeJS.Timeout)
			intervalId.current = null
		}
	}, [])

	return { stopInterval }
}
