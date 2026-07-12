"use client";

import type { ReactNode } from "react";

import { Loader } from "@/components/shared";

import { useAuthGuard, type AuthRequirement } from "./use-auth-guard";

type GuardGateProps = {
  requirement: AuthRequirement;
  children: ReactNode;
};

const GuardGate = ({ requirement, children }: GuardGateProps) => {
  const { isReady, isAllowed } = useAuthGuard(requirement);
  if (!isReady || !isAllowed) return <Loader />;
  return <>{children}</>;
};

/**
 * Wraps a member-only subtree: renders a loader while auth hydrates or a redirect is in
 * flight, and the children only for an active member.
 *
 * @param children - The protected member UI.
 * @returns The children for active members, otherwise a loader.
 * @example
 * <RequireActiveMember>
 *   <ProfileEditor />
 * </RequireActiveMember>
 */
export const RequireActiveMember = ({ children }: { children: ReactNode }) => (
  <GuardGate requirement="active">{children}</GuardGate>
);

/**
 * Wraps an admin-only subtree: renders a loader while auth hydrates or a redirect is in
 * flight, and the children only for an active member holding the `admin` role.
 *
 * @param children - The protected admin UI.
 * @returns The children for admins, otherwise a loader.
 * @example
 * <RequireAdmin>
 *   <AdminDashboard />
 * </RequireAdmin>
 */
export const RequireAdmin = ({ children }: { children: ReactNode }) => (
  <GuardGate requirement="admin">{children}</GuardGate>
);
