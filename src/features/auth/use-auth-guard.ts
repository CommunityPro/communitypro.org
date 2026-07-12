"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "./store";

/** What a guarded route demands of the visitor. */
export type AuthRequirement = "active" | "admin";

/** Outcome of a guard check, for the wrapper to decide whether to render or wait. */
export type AuthGuardResult = {
  /** `true` once hydration has settled (no longer `loading`). */
  isReady: boolean;
  /** `true` when the current user satisfies the requirement. */
  isAllowed: boolean;
};

const meetsRequirement = (
  requirement: AuthRequirement,
  user: NonNullable<ReturnType<typeof useAuthStore.getState>["user"]>,
): boolean => {
  if (user.status !== "active") return false;
  return requirement === "admin" ? user.roles.includes("admin") : true;
};

/**
 * Guards a member/admin route: redirects anonymous visitors to the join page, Pending
 * members to `/welcome`, deactivated members to the join page, and non-admins away from
 * admin routes to home. Returns readiness/allowed flags so the caller can render a loader
 * while hydration settles.
 *
 * @param requirement - `"active"` for the member area, `"admin"` for the admin area.
 * @returns `{ isReady, isAllowed }` for the current auth state.
 * @example
 * const { isReady, isAllowed } = useAuthGuard("active");
 * if (!isReady || !isAllowed) return <Loader />;
 */
export const useAuthGuard = (requirement: AuthRequirement): AuthGuardResult => {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  const isReady = status !== "loading";
  const isAllowed = status === "authenticated" && user !== null && meetsRequirement(requirement, user);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "anonymous" || user === null) {
      router.replace("/join-community");
      return;
    }
    switch (user.status) {
      case "pending":
        router.replace("/welcome");
        return;
      case "deactivated":
        router.replace("/join-community?error=deactivated");
        return;
      case "active":
        if (requirement === "admin" && !user.roles.includes("admin")) router.replace("/");
        return;
    }
  }, [router, status, user, requirement]);

  return { isReady, isAllowed };
};
