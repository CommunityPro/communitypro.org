import { createPersistMiddleware } from "../middleware/persist"

type ThemeMode = "dark" | "light"

interface GlobalStore {
	loading: boolean
	mode: ThemeMode
	setMode: (mode: ThemeMode) => void
}

const initialState: GlobalStore = {
	loading: false,
	mode: "dark",
	setMode: () => {},
}

const useGlobalStore = createPersistMiddleware<GlobalStore>("global", (set) => ({
	...initialState,
	setMode: (mode: ThemeMode) => set({ mode }),
}))

export { useGlobalStore }
