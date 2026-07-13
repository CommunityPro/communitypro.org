import { apiFetch, isApiError } from "@/lib/api";

type SearchTokenResponse = { host: string; token: string; expiresAt: string };

/** A scoped Meilisearch host + bearer token pair for direct browser search calls. */
export type SearchToken = { host: string; token: string };

type CachedToken = SearchToken & { expiresAt: number };

// why: mirrors features/auth/session.ts's single-flight cached-token pattern so bursts of
// search requests share one refresh instead of hammering /search/token.
const EXPIRY_BUFFER_MS = 30_000;
const UNAVAILABLE_CACHE_MS = 60_000;

let cached: CachedToken | null = null;
let unavailableUntil: number | null = null;
let inFlight: Promise<SearchToken | null> | null = null;

const isFresh = (entry: CachedToken | null): entry is CachedToken =>
  entry !== null && Date.now() < entry.expiresAt - EXPIRY_BUFFER_MS;

const isSearchUnavailable = (error: unknown): boolean => isApiError(error) && error.code === "search.unavailable";

const requestToken = async (): Promise<SearchToken | null> => {
  if (unavailableUntil !== null && Date.now() < unavailableUntil) return null;

  try {
    const response = await apiFetch<SearchTokenResponse>("/search/token");
    cached = { host: response.host, token: response.token, expiresAt: Date.parse(response.expiresAt) };
    unavailableUntil = null;
    return { host: cached.host, token: cached.token };
  } catch (error) {
    if (isSearchUnavailable(error)) {
      cached = null;
      unavailableUntil = Date.now() + UNAVAILABLE_CACHE_MS;
      return null;
    }
    throw error;
  }
};

/**
 * Resolves a scoped Meilisearch token, refreshing it via `GET /search/token` when the
 * in-memory copy is missing or within 30s of expiry. Concurrent callers share a single
 * in-flight refresh. When the backend reports search as unavailable (503,
 * `search.unavailable`), the `null` result is cached for 60s so callers fall back to the
 * DB endpoint without hammering a down service.
 *
 * @returns The `{ host, token }` pair, or `null` when search is unavailable.
 * @example
 * const token = await getSearchToken();
 * if (!token) return searchViaFallback(params);
 */
export const getSearchToken = async (): Promise<SearchToken | null> => {
  if (isFresh(cached)) return { host: cached.host, token: cached.token };

  if (!inFlight) {
    inFlight = requestToken().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
};

/**
 * Drops the cached search token (call after a Meilisearch request fails so the next
 * attempt fetches a fresh one instead of retrying with a possibly-stale/invalid token).
 *
 * @returns Nothing.
 * @example
 * invalidateSearchToken();
 */
export const invalidateSearchToken = (): void => {
  cached = null;
};
