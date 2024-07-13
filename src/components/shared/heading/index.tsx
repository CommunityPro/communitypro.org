import classNames from "classnames"
import React from "react"

import type { NativeElementProps } from "@/types"
import { forwardRefWrapper } from "@/utils"
import { useDynamicStyle } from "@/hooks"
import styles from "./heading.module.scss"

type HeadingElements = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

export interface TypographyProps extends NativeElementProps<HeadingElements> {
	/**
	 * The class name to apply to the element.
	 * @default ''
	 */
	className?: string
	/**
	 * The HTML element to render.
	 * @default 'h2'
	 */
	as?: HeadingElements
	/**
	 * The CSS `text-align` property
	 * @default 'left'
	 */
	align?: "left" | "center" | "right" | "justify"
	/**
	 * The font weight of the text.
	 * @default 400
	 */
	weight?: 300 | 400 | 500 | 600 | 700 | 800
	/**
	 * The font size of the text.
	 * @default ''
	 */
	fontSize?: string
	/**
	 * The CSS `text-transform` property
	 * @default 'none'
	 */
	casing?: "uppercase" | "lowercase" | "capitalize" | "none"

	/** The number of lines to truncate the text to.
	 * @default 0
	 */
	noOfLines?: number
	/**
	 * The CSS `lineHeight` property
	 * @default ''
	 */
	lineHeight?: string
	/**
	 * animate the heading
	 */
	animate?: "fade" | "slide" | "none"
}

const HeadingBase = forwardRefWrapper<HTMLHeadingElement, TypographyProps>(
	"Heading",
	{
		as: "h2",
	},

	(props, ref) => {
		const {
			as: Element = "h2",
			children,
			className,
			weight,
			noOfLines,
			casing,
			color,
			lineHeight,
			align,
			animate = "none",
			fontSize,
			...rest
		} = props

		const dynamicClass = useDynamicStyle({
			fontSize: fontSize,
			textTransform: casing,
			textAlign: align,
			color: color,
			lineHeight,
		})

		const _class = classNames(
			styles.Heading,
			dynamicClass,
			styles[`Heading-${Element}`],
			weight && styles[`weight-${weight}`],
			noOfLines && styles[`noOfLines-${noOfLines}`],
			animate && styles[`animate--${animate}`],
			className
		)

		return (
			<Element {...rest} ref={ref} className={_class}>
				{children}
			</Element>
		)
	}
)

/**
 * Responsible for rendering a heading
 * @type {React.ForwardRefExoticComponent<TypographyProps & React.RefAttributes<HTMLElement>>}
 * @interface TypographyProps
 *
 * @param as The HTML element to render.
 * @param children The content of the heading
 * @param className The class name to apply to the element.
 * @param weight The font weight of the text.
 * @param fontSize The font size of the text.
 * @param noOfLines The number of lines to truncate the text to.
 * @returns React.ReactElement
 *
 * @example
 * <Heading>Heading</Heading>
 * <Heading as="h1">Heading</Heading>
 * <Heading.h2>Heading</Heading.h2>
 * <Heading.h3>Heading</Heading.h3>
 */
export const Heading = Object.assign(HeadingBase, {
	h1: (props: TypographyProps) => <HeadingBase as="h1" {...props} />,
	h2: (props: TypographyProps) => <HeadingBase as="h2" {...props} />,
	h3: (props: TypographyProps) => <HeadingBase as="h3" {...props} />,
	h4: (props: TypographyProps) => <HeadingBase as="h4" {...props} />,
	h5: (props: TypographyProps) => <HeadingBase as="h5" {...props} />,
	h6: (props: TypographyProps) => <HeadingBase as="h6" {...props} />,
})
