export type AccessTokenProvider = () => string | null | Promise<string | null>;

// why: indirection lets Phase 1 auth plug a real token source (auth store / refresh relay)
// into apiFetch without the API client depending on auth internals.
let provider: AccessTokenProvider = () => null;

/**
 * Registers the function `apiFetch` calls to obtain the current bearer token.
 *
 * @param next - Returns the access token, or `null` when the visitor is anonymous.
 * @returns Nothing.
 * @example
 * setAccessTokenProvider(() => useAuthStore.getState().accessToken);
 */
export const setAccessTokenProvider = (next: AccessTokenProvider): void => {
  provider = next;
};

/**
 * Resolves the current access token from the registered provider.
 *
 * @returns The bearer token, or `null` when no user is signed in.
 * @example
 * const token = await getAccessToken();
 */
export const getAccessToken = async (): Promise<string | null> => provider();
