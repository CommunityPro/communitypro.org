import { useLayoutEffect } from "react"

/**
 * @name useIsomorphicLayoutEffect
 * This function is a wrapper for the useLayoutEffect hook that checks if the code is running on the
 * server and returns an empty function if it is.
 * @param args - `args` is a rest parameter that allows the function to accept any number of arguments
 * as an array. In this case, it is used to pass any arguments that would normally be passed to the
 * `useLayoutEffect` hook.
 * @returns A function that conditionally calls `useLayoutEffect` or returns an empty function
 * depending on whether the code is running on the server or the client. This function is named
 * `useIsomorphicLayoutEffect` and has the same signature as `useLayoutEffect`.
 *
 * @example
 * useIsomorphicLayoutEffect(() => {
 *  console.log('This will run on the client only');
 * });
 *
 * useIsomorphicLayoutEffect(() => {
 * console.log('This will run on the client only');
 * }, []);
 */
export const useIsomorphicLayoutEffect: typeof useLayoutEffect = (...args) => {
	const isServer = typeof window === "undefined" || !window.document
	// eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
	return isServer ? () => {} : useLayoutEffect(...args)
}
