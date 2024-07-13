import { ReactHTML, HTMLAttributes, DetailedHTMLFactory } from "react"

export type ValuesOf<T> = T extends ReadonlyArray<any> ? T[number] : T[keyof T]

/**
 * Infer the `HTMLElement` type from the given `HTMLAttributes`
 */
export type ElementTypeFromHTMLAttributes<T extends HTMLAttributes<any>> =
	T extends HTMLAttributes<infer E> ? E : never

/**
 * Extend from this type to properly compose native
 * HTML attributes with another interface.
 */
export type IntrinsicElementProps<T extends keyof ReactHTML> =
	ReactHTML[T] extends DetailedHTMLFactory<infer Props, any> ? Props : {}

export type Prettify<T> = {
	[K in keyof T]: T[K]
} & {}

export type AssertHasProps = <Prop extends string>(
	props: Array<Prop>,
	value: object
) => asserts value is Record<Prop, unknown>

export type AssertHasPropsAndType = <Prop extends string, Type>(
	props: Array<Prop>,
	value: object
) => asserts value is Record<Prop, Type>

export type NativeElementProps<T extends keyof ReactHTML> =
	ReactHTML[T] extends DetailedHTMLFactory<infer Props, any> ? Props : {}

export interface FileWithKey {
	file: File
	key: string
	status: string[]
}
