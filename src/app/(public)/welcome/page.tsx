import { ExternalLink, GitMerge, GitPullRequest, UserCheck } from "lucide-react";
import type { Metadata } from "next";

import { PendingStatusActions } from "@/features/auth";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Welcome — one step left | Community Pro",
  description: "Raise a pull request in the practice repo to activate your membership.",
};

const steps = [
  {
    icon: GitPullRequest,
    title: "Open a pull request",
    body: "Head to the practice repo and raise a PR — a small contribution is all it takes.",
  },
  {
    icon: GitMerge,
    title: "Get it merged",
    body: "A maintainer reviews and merges it. That merge is your proof of work.",
  },
  {
    icon: UserCheck,
    title: "You're activated",
    body: "The merge activates your membership automatically — no forms, no waiting rooms.",
  },
];

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-10 px-4 py-24 text-center">
      <div className="flex flex-col gap-3">
        <p className="text-main text-sm font-semibold tracking-widest uppercase">Almost there</p>
        <h1 className="text-4xl font-bold sm:text-5xl">One PR away from membership</h1>
        <p className="text-muted-foreground mx-auto max-w-xl">
          Community Pro membership is earned, not granted. Show us a merged pull request in our practice repo and
          you&apos;re in.
        </p>
      </div>

      <ol className="grid w-full gap-4 sm:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, index) => (
          <li key={title} className="border-border-default flex flex-col items-center gap-3 rounded-2xl border p-6">
            <span className="bg-main/10 text-main grid size-10 place-items-center rounded-full">
              <Icon className="size-5" />
            </span>
            <h2 className="font-semibold">
              {index + 1}. {title}
            </h2>
            <p className="text-muted-foreground text-sm">{body}</p>
          </li>
        ))}
      </ol>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <a
          href={env.practiceRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-main inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
        >
          Open the practice repo
          <ExternalLink className="size-4" />
        </a>
        <PendingStatusActions />
      </div>
    </main>
  );
}
