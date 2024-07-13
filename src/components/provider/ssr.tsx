import React, {
	PropsWithChildren,
	createContext,
	useContext,
	useLayoutEffect,
	useState,
} from "react"

import { StyleProvider } from "./style"

const canUseDOM = Boolean(
	typeof window !== "undefined" && window?.document && window?.document?.createElement
)

interface ISSRContext {
	isServer: boolean
	isClient: boolean
}

const defaultSSRContext: ISSRContext = {
	isServer: !canUseDOM,
	isClient: canUseDOM,
}

const SSRContext = createContext<ISSRContext>(defaultSSRContext)

export const SSRProvider: React.FC<PropsWithChildren & {}> = (props) => {
	const { children } = props

	/**
	 * Copy the default context so that strict equality
	 * checks against the context value are false.
	 */
	const ctx = { ...defaultSSRContext }

	return (
		<SSRContext.Provider value={ctx}>
			<StyleProvider>{children}</StyleProvider>
		</SSRContext.Provider>
	)
}

export function useSSR() {
	const ctx = useContext(SSRContext)
	const isInSSRContext = ctx !== defaultSSRContext
	const [isHydrating, setIsHydrating] = useState(canUseDOM && isInSSRContext)

	if (canUseDOM) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useLayoutEffect(() => setIsHydrating(false), [])
	}

	return { ...ctx, isHydrating }
}
