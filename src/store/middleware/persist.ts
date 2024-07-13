import { StateCreator, create } from "zustand"
import { persist } from "zustand/middleware"

import { reportException } from "./report"

/**
 * Create a persist middleware for zustand
 * @param name - The name of the store
 * @returns The middleware
 *
 * @example
 * const useUserStore = createPersistMiddleware('user')((set) => ({
 *   ...initialState,
 *  setUser: (user) => set({ user }),
 * }));
 *
 * export { useUserStore };
 */
export const createPersistMiddleware = <T>(name: string, storeCreator: StateCreator<T>) =>
	create<T>(
		reportException<T>(
			persist(storeCreator, {
				name: name || "z:root",
			}) as StateCreator<T>
		)
	)
