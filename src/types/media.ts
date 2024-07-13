export type MediaQueryType =
	| "xs"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| (string & NonNullable<unknown>)

export type MediaQQueryType = "lessThan" | "greaterThan" | "greaterThanOrEqual"
