import type { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

/*
 * =====================================================================================
 * BACKEND TRANSPORT SEAM
 * -------------------------------------------------------------------------------------
 * Every assumption about *how* refresh/access tokens move between the backend
 * (`NEXT_PUBLIC_API_URL`) and this Next.js relay lives in THIS file only. When the
 * backend agent finalises the contract, reconciling is a one-file change — the route
 * handlers, the client session, and the store never touch transport details.
 *
 * Assumed contract (documented in the handoff report):
 *  - `GET /auth/callback` (backend) finishes the GitHub code exchange, then redirects the
 *    browser to `${APP_ORIGIN}/api/auth/callback` carrying the freshly minted tokens as
 *    query params: `refresh_token`, `access_token` (optional), `expires_in` (optional).
 *  - `POST /auth/refresh` accepts `{ refreshToken }` JSON and returns
 *    `{ accessToken, refreshToken, expiresIn }` (rotated refresh token).
 *  - `POST /auth/logout` accepts `{ refreshToken }` JSON and revokes it.
 *  - `GET /me` returns `{ status: "Pending" | "Active" | "Deactivated", ... }`.
 *  - The refresh token is opaque and stored ONLY in the httpOnly `cp_refresh` cookie on
 *    the frontend origin; the browser never sees it in JS.
 * =====================================================================================
 */

/** Name of the httpOnly cookie holding the opaque refresh token on the frontend origin. */
export const REFRESH_COOKIE_NAME = "cp_refresh";

const REFRESH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/** A complete set of tokens as returned by the backend refresh endpoint. */
export type TokenBundle = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};

/** Tokens handed to the relay by the backend callback redirect. */
export type CallbackTokens = {
  refreshToken: string;
  accessToken: string | null;
  expiresInSeconds: number | null;
};

/** Membership status as spelled by the backend `/me` endpoint. */
export type BackendMemberStatus = "Pending" | "Active" | "Deactivated";

type RefreshResponseBody = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

const cookieOptions = () =>
  ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS,
  }) as const;

/**
 * Extracts the tokens the backend attached to its post-exchange redirect. Change ONLY
 * this function if the backend switches transport (e.g. one-time exchange code, fragment,
 * or a temporary server-set cookie).
 *
 * @param request - The incoming callback request from the backend redirect.
 * @returns The parsed callback tokens, or `null` when no refresh token is present.
 * @example
 * const tokens = readCallbackTokens(request);
 * if (!tokens) redirectToJoin();
 */
export const readCallbackTokens = (request: NextRequest): CallbackTokens | null => {
  const params = request.nextUrl.searchParams;
  const refreshToken = params.get("refresh_token");
  if (!refreshToken) return null;

  const expiresRaw = params.get("expires_in");
  const expiresInSeconds = expiresRaw ? Number.parseInt(expiresRaw, 10) : null;

  return {
    refreshToken,
    accessToken: params.get("access_token"),
    expiresInSeconds: Number.isFinite(expiresInSeconds) ? expiresInSeconds : null,
  };
};

/**
 * Exchanges the current refresh token for a rotated token bundle via the backend.
 *
 * @param refreshToken - The opaque refresh token read from the `cp_refresh` cookie.
 * @returns The rotated token bundle, or `null` when the backend rejects the token.
 * @example
 * const bundle = await refreshTokens(cookieValue);
 * if (!bundle) return unauthorized();
 */
export const refreshTokens = async (refreshToken: string): Promise<TokenBundle | null> => {
  const response = await fetch(`${env.apiUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) return null;

  const body = (await response.json()) as RefreshResponseBody;
  return {
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    expiresInSeconds: body.expiresIn,
  };
};

/**
 * Best-effort revocation of a refresh token during sign-out. Failures are swallowed so a
 * flaky backend never blocks the user from clearing their local session.
 *
 * @param refreshToken - The opaque refresh token to revoke.
 * @returns Nothing.
 * @example
 * await revokeSession(cookieValue);
 */
export const revokeSession = async (refreshToken: string): Promise<void> => {
  try {
    await fetch(`${env.apiUrl}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch {
    // why: sign-out must always succeed locally; a failed revoke is logged backend-side.
  }
};

/**
 * Reads the caller's membership status from the backend using a bearer access token.
 *
 * @param accessToken - A valid short-lived access token.
 * @returns The backend membership status, or `null` when the lookup fails.
 * @example
 * const status = await fetchMemberStatus(bundle.accessToken);
 */
export const fetchMemberStatus = async (accessToken: string): Promise<BackendMemberStatus | null> => {
  const response = await fetch(`${env.apiUrl}/me`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const body = (await response.json()) as { status?: BackendMemberStatus };
  return body.status ?? null;
};

/**
 * Writes the rotated refresh token to the httpOnly `cp_refresh` cookie on the response.
 *
 * @param response - The outgoing response to attach the cookie to.
 * @param refreshToken - The refresh token to persist.
 * @returns The same response, for chaining.
 * @example
 * return setRefreshCookie(NextResponse.json({ ... }), bundle.refreshToken);
 */
export const setRefreshCookie = (response: NextResponse, refreshToken: string): NextResponse => {
  response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, cookieOptions());
  return response;
};

/**
 * Clears the `cp_refresh` cookie on the response (used on sign-out and refresh failure).
 *
 * @param response - The outgoing response to clear the cookie on.
 * @returns The same response, for chaining.
 * @example
 * return clearRefreshCookie(new NextResponse(null, { status: 204 }));
 */
export const clearRefreshCookie = (response: NextResponse): NextResponse => {
  response.cookies.set(REFRESH_COOKIE_NAME, "", { ...cookieOptions(), maxAge: 0 });
  return response;
};
