import { createContext, useContext, useState } from "react"

import { Style2Class } from "@/utils/style-creator"

export const StyleContext = createContext<any>(null)

export const StyleProvider = ({ children }: { children: React.ReactNode }) => {
	const [styleConverter] = useState(new Style2Class())

	return (
		<StyleContext.Provider value={{ styleConverter }}>{children}</StyleContext.Provider>
	)
}

export const useStyleContext = () => useContext(StyleContext)
