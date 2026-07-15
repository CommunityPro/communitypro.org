// why: server.ts is intentionally NOT re-exported — client components import types
// from this barrel, and the fetch layer (with its token access) must stay server-only.
// Server components import it directly from "@/features/github/server".
export * from "./geocode";
export * from "./types";
