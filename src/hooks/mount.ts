import { useEffect } from "react"

/**
 * @name useMount
 * This is a custom hook in TypeScript that runs a callback function only on mount and not on updates.
 * @param callback - The `callback` parameter is a function that will be executed when the component
 * using the `useMount` hook mounts.
 *
 * @example
 * useMount(() => {
 *  console.log('This will only run once on mount');
 * });
 */
export const useMount = (callback: () => void) => {
	useEffect(() => {
		callback()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []) // Empty dependency array ensures this runs on mount and not on updates
}
