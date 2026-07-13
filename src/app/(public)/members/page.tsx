import type { Metadata } from "next";
import { Suspense } from "react";

import { Loader } from "@/components/shared";
import { MemberDirectory } from "@/features/members";

export const metadata: Metadata = {
  title: "Members | Community Pro",
  description: "Search and filter the Community Pro member directory by skill, role, and experience.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:py-28">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-medium sm:text-4xl">Members</h1>
        <p className="text-muted-foreground">Find and connect with growth-focused engineers across the community.</p>
      </div>
      <Suspense fallback={<Loader className="h-auto min-h-96 w-full" />}>
        <MemberDirectory />
      </Suspense>
    </div>
  );
}
