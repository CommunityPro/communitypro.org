import {
	forwardRef,
	ForwardRefExoticComponent,
	ForwardRefRenderFunction,
	PropsWithoutRef,
	RefAttributes,
} from "react"

/**
 * Wraps `React.forwardRef` and applies a semantic `displayName` and
 * `defaultProps` without side effects.
 *
 * This wrapper is required to properly tree-shake `React.forwardRef`
 * components, otherwise the minifier can't understand that `defaultProps` and
 * `displayName` are pure.
 */

export function forwardRefWrapper<T, P = {}>(
	name: string,
	defaultPropsOrRender:
		| Partial<PropsWithoutRef<P> & RefAttributes<T>>
		| undefined
		| ForwardRefRenderFunction<T, P>,
	definitelyRender?: ForwardRefRenderFunction<T, P>
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
	/**
	 * If `defaultPropsOrRender` is an object, then `definitelyRender` is the render function.
	 */
	const render =
		typeof defaultPropsOrRender === "object" ? definitelyRender : defaultPropsOrRender

	/** If `defaultPropsOrRender` is a function, then there are no `defaultProps`. */
	const defaultProps =
		typeof defaultPropsOrRender === "function" ? {} : defaultPropsOrRender

	const pristineComponent = forwardRef(render!)
	pristineComponent.displayName = name
	pristineComponent.defaultProps = defaultProps
	return pristineComponent
}
