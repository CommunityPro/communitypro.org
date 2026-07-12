import { setAccessTokenProvider } from "@/lib/api";

type CachedToken = { token: string; expiresAt: number };

type RefreshResponse = { accessToken: string; expiresIn: number };

// why: the access token lives only in memory (never localStorage) and is refreshed via the
// httpOnly-cookie relay; a 30s buffer avoids handing out a token that expires mid-request.
const EXPIRY_BUFFER_MS = 30_000;

let cached: CachedToken | null = null;
let inFlight: Promise<string | null> | null = null;

const isFresh = (entry: CachedToken | null): entry is CachedToken =>
  entry !== null && Date.now() < entry.expiresAt - EXPIRY_BUFFER_MS;

const requestRefresh = async (): Promise<string | null> => {
  // why: the relay is same-origin and browser-only; server-side callers have no cookie jar.
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch("/api/auth/refresh", { method: "POST" });
    if (!response.ok) {
      cached = null;
      return null;
    }
    const body = (await response.json()) as RefreshResponse;
    cached = { token: body.accessToken, expiresAt: Date.now() + body.expiresIn * 1_000 };
    return cached.token;
  } catch {
    cached = null;
    return null;
  }
};

/**
 * Resolves the current access token, refreshing it through `/api/auth/refresh` when the
 * in-memory copy is missing or near expiry. Concurrent callers share a single in-flight
 * refresh (single-flight) so a burst of requests triggers at most one network round-trip.
 *
 * @returns The bearer token, or `null` when the visitor has no valid session.
 * @example
 * const token = await getSessionToken();
 * if (token) headers.set("Authorization", `Bearer ${token}`);
 */
export const getSessionToken = async (): Promise<string | null> => {
  if (isFresh(cached)) return cached.token;

  if (!inFlight) {
    inFlight = requestRefresh().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
};

/**
 * Drops the cached access token (call after sign-out so no stale token is reused).
 *
 * @returns Nothing.
 * @example
 * clearSessionToken();
 */
export const clearSessionToken = (): void => {
  cached = null;
};

// why: registering here (module side effect) wires apiFetch to the session before any
// query runs, since AuthProvider imports this module at app bootstrap.
setAccessTokenProvider(getSessionToken);
