"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "./reveal";

import type { HomeData } from "@/features/github";

type HowItWorksProps = {
  practiceRepo: HomeData["practiceRepo"];
};

/**
 * The three-step activation story as numbered editorial rows. Step two links to
 * the real practice repo with its live fork/star counts.
 *
 * @param practiceRepo - Practice repo stats from getHomeData, or null.
 * @returns The how-it-works section.
 * @example
 * <HowItWorks practiceRepo={data.practiceRepo} />
 */
export const HowItWorks = ({ practiceRepo }: HowItWorksProps) => {
  const steps = [
    {
      number: "01",
      title: "Sign in with GitHub",
      description: "No forms, no fees, no gatekeeping interview. Your GitHub account is your application.",
      meta: null,
    },
    {
      number: "02",
      title: "Raise one pull request",
      description: "Open a PR in the practice repo. Any honest contribution counts — docs, code, a fix.",
      meta: practiceRepo
        ? { href: practiceRepo.url, label: `${practiceRepo.forks} forks · ${practiceRepo.stars} stars` }
        : null,
    },
    {
      number: "03",
      title: "Merge your way in",
      description:
        "The moment it merges, a webhook activates your membership. Profile, mentorship, events — all of it.",
      meta: null,
    },
  ];

  return (
    <div className="space-y-20">
      <Reveal>
        <p className="text-muted-foreground mb-8 font-mono text-xs tracking-[0.35em] uppercase">[ How it works ]</p>
        <h2 className="max-w-3xl text-4xl leading-tight font-medium text-balance sm:text-6xl">
          Three steps. The last one is a merge.
        </h2>
      </Reveal>
      <div className="border-border-default divide-border-default divide-y border-t">
        {steps.map((step, index) => (
          <Reveal delay={index * 0.08} key={step.number}>
            <div className="grid gap-x-10 gap-y-4 py-12 sm:grid-cols-[80px_1fr_auto] sm:items-baseline">
              <span className="text-muted-foreground font-mono text-sm">{step.number}</span>
              <div className="max-w-xl space-y-3">
                <h3 className="text-2xl font-medium sm:text-3xl">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              {step.meta && (
                <Link
                  className="link text-foreground before:bg-foreground flex items-center gap-x-1.5 font-mono text-xs"
                  href={step.meta.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {step.meta.label}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};
