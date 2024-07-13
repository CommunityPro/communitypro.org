import React, { useMemo } from "react"

/**
 * Returns a memoized `CSSStyleDeclaration` object.
 */
export function useStyles(styles: React.CSSProperties): React.CSSProperties {
	const removeFalsy = (obj: any) =>
		Object.keys(obj)
			.filter((k) => obj[k] !== null)
			.reduce((a, k) => ({ ...a, [k]: obj[k] }), {})

	return useMemo(
		() => ({ ...removeFalsy(styles) }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[JSON.stringify(styles), removeFalsy]
	)
}
