import { useMemo } from "react"

import { useStyleContext } from "@/components/provider"

/**
 * useDynamicStyle is a hook that takes a styles object and returns a string of
 * class names that can be used to apply dynamic styles to an element.
 * @param {React.CSSProperties} styles - The styles object to convert to class names
 * @returns {string} - The class names to apply to the element
 *
 * @example
 * const styles = {
 *   backgroundColor: 'red',
 *  color: 'white',
 * fontSize: '16px',
 * };
 *
 * const className = useDynamicStyle(styles);
 *
 * return <div className={className}>Hello, world!</div>; // The div will have the styles applied to it
 */
export const useDynamicStyle = (styles: React.CSSProperties) => {
	const { styleConverter } = useStyleContext()

	const className = useMemo(() => {
		return Object.entries(styles)
			.reduce((acc, [property, value]) => {
				if (!property || !value || typeof property === "undefined") return acc

				const dynamicClassName = styleConverter.applyStyle(property, value)
				return `${acc} ${dynamicClassName}`
			}, "")
			.trim()
	}, [styleConverter, styles])

	return className
}
