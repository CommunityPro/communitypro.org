import React, { CSSProperties } from "react"
import classNames from "classnames"

import { useDynamicStyle, useMediaQuery } from "@/hooks"
import { forwardRefWrapper } from "@/utils"
import styles from "./flex.module.scss"

type MainAxisAlignment =
	| "normal"
	| "flex-start"
	| "flex-end"
	| "center"
	| "left"
	| "right"
	| "baseline"
	| "first baseline"
	| "last baseline"
	| "space-between"
	| "space-around"
	| "space-evenly"
	| "stretch"
	| "safe"
	| "unsafe"

type CrossAxisAlignment =
	| "normal"
	| "flex-start"
	| "flex-end"
	| "self-start"
	| "self-end"
	| "center"
	| "baseline"
	| "first baseline"
	| "last baseline"
	| "stretch"
	| "safe"
	| "unsafe"

type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse"
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse"

interface IFlex {
	/**
	 * Defines the direction of the flex container
	 */
	justifyContent?: MainAxisAlignment
	alignItems?: CrossAxisAlignment
	alignSelf?: CrossAxisAlignment | "auto"
	alignContent?: CrossAxisAlignment
	flexWrap?: FlexWrap

	/**
	 * Flexbox properties
	 */
	flex?: string
	direction?: FlexDirection
	grow?: number
	shrink?: number
	basis?: string
	responsiveScroll?: boolean
	scrollable?: boolean
	fullWidth?: boolean
	background?: string
	gap?: string | number
	css?: CSSProperties

	sm?: CSSProperties
	md?: CSSProperties
	lg?: CSSProperties
	xl?: CSSProperties
}

export interface IFlexProps extends React.HTMLAttributes<HTMLDivElement>, IFlex {}

const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "")

export const buildFlex = (type: "" | "row" | "column" = "") => {
	return forwardRefWrapper<HTMLDivElement, IFlexProps>(
		`Flex${capitalize(type)}`,
		(
			{
				children,
				responsiveScroll,
				scrollable = false,
				css,
				gap,
				basis,
				flex,
				className,
				sm,
				md,
				xl,
				lg,
				fullWidth,
				background,
				color,
				...rest
			},
			ref
		) => {
			const dynamicClassName = useDynamicStyle({
				gap: gap,
				flexBasis: basis,
				flex: flex,
				background: background,
				color: color,
			})

			const _class = classNames([
				styles[`Flex${capitalize(type)}`],
				scrollable && "custom-scrollbar",
				scrollable && styles.FlexScroll,
				responsiveScroll && styles.FlexResponsiveScroll,
				fullWidth && "w-full",
				className,
				dynamicClassName,
				buildProperties(rest),
			])

			const isMediaQuery =
				(Object.keys(rest).some((key) => key.match(/sm|md|lg|xl/)) && sm) ??
				md ??
				xl ??
				(lg || false)
			const matchQuery = useMediaQuery(
				Object.keys(rest).find((key) => key.match(/sm|md|lg|xl/)) ?? "sm",
				"greaterThan"
			)

			const excludeBuildProperties = (props: IFlex) => {
				const {
					justifyContent,
					alignItems,
					alignSelf,
					alignContent,
					flexWrap,
					direction,
					grow,
					shrink,
					...rest
				} = props
				return rest
			}

			return (
				<div
					ref={ref}
					className={_class}
					style={{
						...css,
						...(matchQuery && isMediaQuery),
					}}
					{...excludeBuildProperties(rest)}>
					{children}
				</div>
			)
		}
	)
}

const buildProperties = (props: IFlex) => {
	const alignSelfMapping = {
		auto: "self-auto",
		"flex-start": "self-start",
		"flex-end": "self-end",
		center: "self-center",
		baseline: "self-baseline",
		stretch: "self-stretch",
	} as const

	// Mapping for alignContent
	const alignContentMapping = {
		"flex-start": "content-start",
		"flex-end": "content-end",
		center: "content-center",
		"space-between": "content-between",
		"space-around": "content-around",
		"space-evenly": "content-evenly",
		stretch: "content-stretch",
	} as const

	// Mapping for flexWrap
	const flexWrapMapping = {
		nowrap: "flex-nowrap",
		wrap: "flex-wrap",
		"wrap-reverse": "flex-wrap-reverse",
	} as const

	// Mapping for flexDirection
	const flexDirectionMapping = {
		row: "flex-row",
		"row-reverse": "flex-row-reverse",
		column: "flex-col",
		"column-reverse": "flex-col-reverse",
	} as const

	const justifyContentMapping = {
		"flex-start": "justify-start",
		"flex-end": "justify-end",
		center: "justify-center",
		"space-between": "justify-between",
		"space-around": "justify-around",
		"space-evenly": "justify-evenly",
	} as const

	const alignItemsMapping = {
		"flex-start": "items-start",
		"flex-end": "items-end",
		center: "items-center",
		baseline: "items-baseline",
		stretch: "items-stretch",
	} as const

	const justifyContentClass =
		justifyContentMapping[props.justifyContent as keyof typeof justifyContentMapping]
	const alignItemsClass =
		alignItemsMapping[props.alignItems as keyof typeof alignItemsMapping]

	const alignSelfClass = alignSelfMapping[props.alignSelf as keyof typeof alignSelfMapping]
	const alignContentClass =
		alignContentMapping[props.alignContent as keyof typeof alignContentMapping]
	const flexWrapClass = flexWrapMapping[props.flexWrap as keyof typeof flexWrapMapping]
	const flexDirectionClass =
		flexDirectionMapping[props.direction as keyof typeof flexDirectionMapping]

	const flexGrowClass = props.grow !== undefined ? `flex-grow-${props.grow}` : ""
	const flexShrinkClass = props.shrink !== undefined ? `flex-shrink-${props.shrink}` : ""

	const classNames = [
		justifyContentClass,
		alignItemsClass,
		alignSelfClass,
		alignContentClass,
		flexWrapClass,
		flexDirectionClass,
		flexGrowClass,
		flexShrinkClass,
	]
		.filter(Boolean)
		.join(" ")

	return classNames
}

/**
 * Flex is a component that is used to create a flex container.
 * @type {forwardRefWrapperExoticComponent<IFlexProps & React.RefAttributes<HTMLDivElement>>}
 * @interface IFlexProps
 *
 *
 * @example
 * <Flex></Flex>
 */
export const Flex = Object.assign(buildFlex(""), {
	Row: buildFlex("row"),
	Column: buildFlex("column"),
})
