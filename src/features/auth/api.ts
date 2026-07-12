import { apiFetch } from "@/lib/api";

import { clearSessionToken } from "./session";
import type { AuthUser } from "./store";

/** Raw shape of the backend `GET /me` response (status uses backend PascalCase spelling). */
export type MeResponse = {
  id: string;
  githubLogin: string;
  displayName: string;
  status: "Pending" | "Active" | "Deactivated";
  roles: string[];
};

const toAuthStatus = (status: MeResponse["status"]): AuthUser["status"] => {
  switch (status) {
    case "Pending":
      return "pending";
    case "Active":
      return "active";
    case "Deactivated":
      return "deactivated";
  }
};

/**
 * Fetches the signed-in user from `GET /me` through `apiFetch` (which attaches the bearer
 * token) and normalizes it into the client `AuthUser` shape.
 *
 * @returns The current user; throws `ApiRequestError` (401 when anonymous).
 * @example
 * const user = await fetchMe();
 * if (user.status === "pending") router.push("/welcome");
 */
export const fetchMe = async (): Promise<AuthUser> => {
  const me = await apiFetch<MeResponse>("/me");
  return {
    id: me.id,
    githubLogin: me.githubLogin,
    displayName: me.displayName,
    status: toAuthStatus(me.status),
    roles: me.roles,
  };
};

/**
 * Signs the user out via the logout relay and drops the cached access token.
 *
 * @returns Nothing.
 * @example
 * await signOut();
 * useAuthStore.getState().clear();
 */
export const signOut = async (): Promise<void> => {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    clearSessionToken();
  }
};
