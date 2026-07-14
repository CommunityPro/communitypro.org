"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

import type { OrgStats } from "@/features/github";

/**
 * Closing dark panel with a radial yellow glow and a single call to action.
 * The microcopy carries the live member count when stats are available.
 *
 * @param stats - Org stats for the member count line, or null.
 * @returns The CTA section.
 * @example
 * <Cta stats={data.stats} />
 */
export const Cta = ({ stats }: { stats: OrgStats | null }) => (
  <section className="bg-panel relative overflow-hidden px-6 py-28 sm:py-40">
    <div
      aria-hidden
      className="bg-main/20 absolute -top-1/2 left-1/2 size-144 -translate-x-1/2 rounded-full blur-[140px]"
    />
    <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-y-10 text-center">
      <Reveal>
        <h2 className="text-panel-foreground text-4xl leading-tight text-balance sm:text-7xl">
          Stop scrolling. Start <span className="text-main italic">shipping</span> with people.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-panel-foreground/60 font-mono text-sm">
          {stats ? `${stats.members.toLocaleString()} members` : "open membership"} · no fees · one merged PR to join
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <Button asChild className="shadow-main/30 shadow-2xl" size="xl">
          <Link href="/join-community">Join Our Community</Link>
        </Button>
      </Reveal>
    </div>
  </section>
);
