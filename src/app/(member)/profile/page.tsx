import type { Metadata } from "next";

import { ProfileForm } from "@/features/members";

export const metadata: Metadata = {
  title: "Your profile | Community Pro",
};

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-4 py-16">
      <div className="space-y-2">
        <p className="text-main text-sm font-semibold tracking-widest uppercase">Your profile</p>
        <h1 className="text-4xl font-bold">Edit your profile</h1>
        <p className="text-muted-foreground">This is what the community sees on the spotlight and members directory.</p>
      </div>
      <ProfileForm />
    </main>
  );
}
