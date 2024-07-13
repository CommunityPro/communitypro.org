import { useStore } from "zustand"

/**
 * Create an async action for zustand
 * @param type - The type of the action
 * @param asyncFn - The async function
 * @returns The async action
 *
 * @example
 * const useUserStore = create((set) => ({
 * ...initialState,
 * setUser: (user) => set({ user }),
 * }));
 *
 * const fetchUser = async (payload, { dispatch }) => {
 *   const user = await fetch(`/api/user/${payload}`);
 *
 *   dispatch((state) => {
 *     state.setUser(user);
 *   });
 *
 *   return user;
 * };
 *
 * const fetchUserAction = createAsyncAction('FETCH_USER', fetchUser);
 *
 * export { useUserStore, fetchUserAction };
 */
const createAsyncAction =
	async (
		type: string,
		asyncFn: (
			payload: any,
			{
				dispatch,
			}: {
				dispatch: typeof useStore
			}
		) => Promise<any>
	) =>
	async (payload: any, { useStore }: any) => {
		console.log({ type: `${type}_START` })
		try {
			await asyncFn(payload, {
				dispatch: useStore,
			})

			console.log({ type: `${type}_SUCCESS` })
		} catch (error) {
			console.log({ type: `${type}_ERROR` })
		}
	}

export { createAsyncAction }
