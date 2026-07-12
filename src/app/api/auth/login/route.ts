import { NextResponse } from "next/server";

import { env } from "@/lib/env";

/**
 * Kicks off GitHub sign-in by redirecting the browser to the backend OAuth entry point.
 * A full-page navigation (not client routing) is required so the browser follows the
 * subsequent redirect out to GitHub.
 *
 * @returns A 307 redirect to `${NEXT_PUBLIC_API_URL}/auth/github`.
 * @example
 * // In markup: <a href="/api/auth/login">Continue with GitHub</a>
 */
export const GET = (): NextResponse => {
  return NextResponse.redirect(`${env.apiUrl}/auth/github`);
};
