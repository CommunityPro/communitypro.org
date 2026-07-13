import { createReportableStore } from "@/store/middleware";
import { fetchMe } from "./api";

/** Signed-in user shape returned by `GET /me`, normalized to client conventions. */
export type AuthUser = {
  id: string;
  githubLogin: string;
  displayName: string;
  status: "pending" | "active" | "deactivated";
  roles: string[];
};

/** Client-side auth lifecycle: `anonymous` until hydrated, `loading` during hydration. */
export type AuthStatus = "anonymous" | "loading" | "authenticated";

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  hydrate: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  clear: () => void;
};

/**
 * Zustand store for client-side auth state; the pattern example for feature stores
 * (each feature co-locates its own store under `features/<feature>/store.ts`).
 *
 * `hydrate` resolves the session against `GET /me` (via `apiFetch`, which pulls a fresh
 * access token from the refresh-cookie relay). Any failure — including a 401 for an
 * anonymous visitor — settles the store in `anonymous`.
 *
 * @returns Hook giving access to `user`, `status`, and auth actions.
 * @example
 * const status = useAuthStore((state) => state.status);
 * if (status === "anonymous") return <JoinUsButton />;
 */
// why: starting at "loading" (not "anonymous") keeps guards from redirecting during the
// window between first render and AuthProvider's hydrate effect settling the real status.
export const useAuthStore = createReportableStore<AuthState>((set) => ({
  user: null,
  status: "loading",
  hydrate: async () => {
    set({ status: "loading" });
    try {
      set({ user: await fetchMe(), status: "authenticated" });
    } catch {
      set({ user: null, status: "anonymous" });
    }
  },
  setUser: (user) => set({ user, status: "authenticated" }),
  clear: () => set({ user: null, status: "anonymous" }),
}));
