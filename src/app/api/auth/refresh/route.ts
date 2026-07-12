import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  REFRESH_COOKIE_NAME,
  clearRefreshCookie,
  refreshTokens,
  setRefreshCookie,
} from "@/features/auth/server/tokens";

/**
 * Mints a short-lived access token for the client using the httpOnly refresh cookie,
 * rotating the cookie in the process. The refresh token itself never reaches the browser
 * in JS — only the access token and its lifetime are returned.
 *
 * @returns `{ accessToken, expiresIn }` on success, or a 401 (with the cookie cleared)
 *   when there is no valid session.
 * @example
 * const res = await fetch("/api/auth/refresh", { method: "POST" });
 * const { accessToken, expiresIn } = await res.json();
 */
export const POST = async (): Promise<NextResponse> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "no_session" }, { status: 401 });
  }

  const bundle = await refreshTokens(refreshToken);
  if (!bundle) {
    return clearRefreshCookie(NextResponse.json({ error: "invalid_session" }, { status: 401 }));
  }

  const response = NextResponse.json({
    accessToken: bundle.accessToken,
    expiresIn: bundle.expiresInSeconds,
  });
  return setRefreshCookie(response, bundle.refreshToken);
};
