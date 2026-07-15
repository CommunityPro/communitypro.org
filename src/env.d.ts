export const requiredEnvs = ["NEXT_PUBLIC_API_URL"] as const;

type RequiredEnvs = (typeof requiredEnvs)[number];

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<RequiredEnvs, string> {
      readonly NEXT_PUBLIC_API_URL: string;
      readonly NEXT_PUBLIC_POSTHOG_KEY?: string;
      readonly NEXT_PUBLIC_GITHUB_ORG?: string;
      readonly NEXT_PUBLIC_PRACTICE_REPO?: string;
      readonly GITHUB_API_TOKEN?: string;
    }
  }
}

export {};
