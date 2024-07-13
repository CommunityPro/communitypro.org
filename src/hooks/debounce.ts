import { useEffect, useState } from "react"

/**
 * @name useDebounce
 * The useDebounce function takes in a value and delay, and returns a debounced value that is updated
 * after the delay has passed since the last update to the value.
 * @param {T} value - The value that needs to be debounced. It can be of any type, hence the use of a
 * generic type T.
 * @param {number} delay - The delay parameter is a number that represents the time in milliseconds
 * that the function should wait before updating the debounced value. This means that if the value of
 * the input changes, the debounced value will not be updated immediately, but only after the specified
 * delay has passed.
 * @returns The `useDebounce` hook returns the `debouncedValue` state variable, which is of type `T`.
 * The `debouncedValue` is updated after a specified `delay` when the `value` prop changes. The
 * returned `debouncedValue` is the latest value after the delay has passed.
 *
 * @example
 * const [value, setValue] = useState('');
 * const debouncedValue = useDebounce(value, 500);
 *
 * console.log(value, debouncedValue); // '', ''
 *
 * setValue('Hello');
 *
 * console.log(value, debouncedValue); // 'Hello', ''
 */
export const useDebounce = <T extends unknown>(value: T, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)

	useEffect(() => {
		if (typeof window === "undefined") return
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue as T
}
