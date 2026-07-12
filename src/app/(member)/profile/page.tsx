import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your profile | Community Pro",
};

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-main text-sm font-semibold tracking-widest uppercase">You&apos;re in</p>
      <h1 className="text-4xl font-bold">Welcome to Community Pro</h1>
      {/* why: placeholder until Phase 2 ships profile editing — keeps the post-activation
          redirect from landing on a 404. */}
      <p className="text-muted-foreground max-w-md">
        Profile setup is on its way. Soon you&apos;ll add your skills, portfolio link, and avatar here.
      </p>
    </main>
  );
}
