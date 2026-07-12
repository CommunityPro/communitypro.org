import type { Metadata } from "next";

import { SignInButton } from "@/features/auth";

export const metadata: Metadata = {
  title: "Join the community | Community Pro",
  description: "Sign in with GitHub, raise one pull request, and earn your membership.",
};

const errorMessages: Record<string, string> = {
  deactivated: "This account has been deactivated. Reach out to an admin if you think that's a mistake.",
  oauth_failed: "GitHub sign-in didn't complete. Give it another try.",
  status_unavailable: "We couldn't confirm your membership status. Please sign in again.",
};

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const errorMessage = error ? errorMessages[error] : undefined;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold sm:text-5xl">Join Community Pro</h1>
        <p className="text-muted-foreground mx-auto max-w-lg">
          Membership is earned with a single merged pull request. Sign in with GitHub to get started — we&apos;ll walk
          you through the rest.
        </p>
      </div>
      {errorMessage ? <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p> : null}
      <SignInButton size="xl" />
    </main>
  );
}
