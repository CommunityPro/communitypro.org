import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { REFRESH_COOKIE_NAME, clearRefreshCookie, revokeSession } from "@/features/auth/server/tokens";

/**
 * Signs the user out: revokes the refresh token backend-side (best effort) and clears the
 * httpOnly `cp_refresh` cookie so no session survives locally.
 *
 * @returns A 204 response with the refresh cookie cleared.
 * @example
 * await fetch("/api/auth/logout", { method: "POST" });
 */
export const POST = async (): Promise<NextResponse> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (refreshToken) await revokeSession(refreshToken);

  return clearRefreshCookie(new NextResponse(null, { status: 204 }));
};
