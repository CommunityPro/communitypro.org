"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

// why: importing the session module registers the access-token provider on apiFetch
// (module side effect) before any query runs.
import "./session";
import { useAuthStore } from "./store";

/**
 * App-level auth bootstrap: registers the session token provider and hydrates the auth
 * store from `GET /me` once on mount. Renders its children unchanged.
 *
 * @param children - The app subtree.
 * @returns The children, after kicking off hydration.
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{children}</>;
};
