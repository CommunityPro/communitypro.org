import { NextResponse, type NextRequest } from "next/server";

import {
  fetchMemberStatus,
  readCallbackTokens,
  refreshTokens,
  setRefreshCookie,
  type BackendMemberStatus,
} from "@/features/auth/server/tokens";

const destinationForStatus = (status: BackendMemberStatus | null): string => {
  switch (status) {
    case "Active":
      return "/profile";
    case "Pending":
      return "/welcome";
    case "Deactivated":
      return "/join-community?error=deactivated";
    default:
      return "/join-community?error=status_unavailable";
  }
};

/**
 * Completes the GitHub sign-in relay: reads the tokens the backend attached to its
 * post-exchange redirect, persists the refresh token in the httpOnly `cp_refresh` cookie,
 * resolves the member's status, and redirects onward (Pending → `/welcome`,
 * Active → `/profile`).
 *
 * @param request - The backend redirect carrying the freshly minted tokens.
 * @returns A redirect response with the refresh cookie set on success.
 * @example
 * // Backend redirects to: /api/auth/callback?refresh_token=...&access_token=...
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const tokens = readCallbackTokens(request);
  if (!tokens) {
    return NextResponse.redirect(new URL("/join-community?error=oauth_failed", request.url));
  }

  // why: the backend may omit the access token from the redirect; rotate once to obtain one.
  let { refreshToken, accessToken } = tokens;
  if (!accessToken) {
    const bundle = await refreshTokens(refreshToken);
    if (!bundle) {
      return NextResponse.redirect(new URL("/join-community?error=oauth_failed", request.url));
    }
    refreshToken = bundle.refreshToken;
    accessToken = bundle.accessToken;
  }

  const status = await fetchMemberStatus(accessToken);
  const response = NextResponse.redirect(new URL(destinationForStatus(status), request.url));
  return setRefreshCookie(response, refreshToken);
};
