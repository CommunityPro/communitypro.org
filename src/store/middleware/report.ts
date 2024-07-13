import { type StateCreator, create } from "zustand"

export const reportException =
	<T>(stateCreator: StateCreator<T>): StateCreator<T> =>
	(set, get, api) =>
		stateCreator(
			(args) => {
				try {
					set(args)
				} catch (err: unknown) {
					console.error("Error :(", err)

					// This is a custom function that sends the error to a service
					// trackError(err, window.location.href)

					throw err
				}
			},
			get,
			api
		)

/**
 * Create a reportable store for zustand
 * @param storeCreator - The store creator
 * @returns The store
 *
 * @example
 * const useUserStore = createReportableStore((set) => ({
 *  ...initialState,
 * setUser: (user) => set({ user }),
 * }));
 *
 * export { useUserStore };
 */
export const createReportableStore = <T>(storeCreator: StateCreator<T>) =>
	create<T>()(reportException<T>(storeCreator))
