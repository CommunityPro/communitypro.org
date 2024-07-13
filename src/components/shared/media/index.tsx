import { Slot } from "@radix-ui/themes"
import React from "react"

import { MediaQQueryType, MediaQueryType } from "@/types"
import { useMediaQuery } from "@/hooks/media"

export interface MediaProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * The media query to be used for the component
	 */
	query: MediaQueryType

	/**
	 * The type of query to be used for the component
	 */
	queryType?: MediaQQueryType
}

/**
 * Responsible for rendering a media query component
 * @type {React.ForwardRefExoticComponent<MediaProps & React.RefAttributes<HTMLElement>>}
 * @interface MediaProps
 *
 * @param query The media query to be used for the component
 * @param queryType The type of query to be used for the component

 * @returns React.ReactElement
 *
 * @example
 * <Media query="sm" queryType="greaterThan">
 *  <div>Content</div>
 * </Media>
 *
 * <Media query="sm" queryType="lessThan">
 *  <div>Content</div>
 * </Media>
 */
export function Media(props: MediaProps) {
	const { query, queryType, children, ...otherProps } = props
	const matches = useMediaQuery(query, queryType)
	const getDirectChildType = React.Children.toArray(children)[0] as unknown as {
		type: string
		props: {
			href?: string
		}
	}
	const canRenderAriaLabel =
		!getDirectChildType?.props?.href || getDirectChildType?.type !== "button"

	return matches ? (
		<Slot
			aria-hidden={!matches}
			{...(canRenderAriaLabel && {
				"aria-label": `This element is ${
					["lessThan", "greaterThan"].includes(queryType!) ? "hidden" : "visible"
				} when this screen size is ${queryType} ${query}`,
			})}
			{...otherProps}>
			{children}
		</Slot>
	) : null
}
