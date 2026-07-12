const required = (name: string, value: string | undefined): string => {
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable "${name}". Add it to .env.local (see .env.example).`);
  }
  return value;
};

/**
 * Typed accessor for public (browser-safe) environment variables.
 *
 * Reads are lazy getters so pages that never touch the API don't crash at module load,
 * but the first access of a missing required variable fails fast with a clear message.
 *
 * @returns An object exposing `apiUrl` (required), `posthogKey` (optional), and the
 *   onboarding practice-repo config (`githubOrg`, `practiceRepo`, `practiceRepoUrl`).
 * @example
 * import { env } from "@/lib/env";
 *
 * const response = await fetch(`${env.apiUrl}/members`);
 */
export const env = {
  get apiUrl(): string {
    return required("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);
  },
  get posthogKey(): string | undefined {
    return process.env.NEXT_PUBLIC_POSTHOG_KEY || undefined;
  },
  // why: org/repo slugs are still TBD from the user — default to "TBD" so pages render
  // rather than crash, and the placeholder is visible in the built practice-repo link.
  get githubOrg(): string {
    return process.env.NEXT_PUBLIC_GITHUB_ORG || "TBD";
  },
  get practiceRepo(): string {
    return process.env.NEXT_PUBLIC_PRACTICE_REPO || "TBD";
  },
  get practiceRepoUrl(): string {
    return `https://github.com/${this.githubOrg}/${this.practiceRepo}`;
  },
} as const;
