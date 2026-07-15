"use client";

import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HeroCardFace } from "./hero-card-face";
import { EASE_OUT } from "./reveal";

import type { FeaturedMember, OrgMember, OrgStats } from "@/features/github";

const HeroCard3d = dynamic(() => import("./hero-card-3d"), { ssr: false });

const PRACTICE_REPO_NAME = process.env.NEXT_PUBLIC_PRACTICE_REPO || "Practice-Contribution";

type HeroProps = {
  featured: FeaturedMember | null;
  stats: OrgStats | null;
  faces: OrgMember[];
};

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, ease: EASE_OUT, delay },
});

/**
 * Stacked hero: centered statement copy on top, the WebGL member card below.
 * The avatar strip and member count are live GitHub org data; the card shows the
 * practice repo's top contributor. Falls back to a flat card without WebGL when
 * the user prefers reduced motion.
 *
 * @param featured - Top contributor for the card, or null to hide the card.
 * @param stats - Org stats for the live member count line.
 * @param faces - Members whose avatars appear in the proof strip.
 * @returns The hero section content.
 * @example
 * <Hero faces={data.wall.slice(0, 5)} featured={data.featured} stats={data.stats} />
 */
export const Hero = ({ featured, stats, faces }: HeroProps) => {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-y-16 text-center sm:gap-y-24">
      <div className="flex max-w-4xl flex-col items-center gap-y-8">
        <motion.div {...enter(0)} className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          {faces.length > 0 && (
            <span className="flex -space-x-2.5">
              {faces.map((face) => (
                <Image
                  alt={face.login}
                  className="border-background size-7 rounded-full border-2"
                  height={28}
                  key={face.login}
                  src={face.avatarUrl}
                  width={28}
                />
              ))}
            </span>
          )}
          <p className="text-muted-foreground font-mono text-xs tracking-wide uppercase">
            {stats ? `${stats.members.toLocaleString()} members · since ${stats.foundedYear}` : "an open community"}
          </p>
        </motion.div>
        <motion.h1 {...enter(0.08)} className="text-5xl leading-[0.95] font-medium text-balance sm:text-8xl">
          Where pros actually hang&nbsp;out.
        </motion.h1>
        <motion.p {...enter(0.16)} className="text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg">
          A members-only community for designers, engineers and builders shipping real things. No gurus, no generic
          threads — just your people, a portfolio that doesn&apos;t suck, and events worth leaving the terminal for.
        </motion.p>
        <motion.div {...enter(0.24)} className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="xl">
            <Link href="/join-community">Join Community</Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/sponsors">Become a Sponsor</Link>
          </Button>
        </motion.div>
      </div>
      {featured && (
        <motion.div {...enter(0.36)} className="relative min-h-150 w-full">
          <div aria-hidden className="bg-main/25 absolute inset-x-1/4 top-1/4 bottom-1/4 rounded-full blur-3xl" />
          {reducedMotion ? (
            <div className="border-border-default bg-background relative mx-auto w-fit rounded-3xl border shadow-xl">
              <HeroCardFace member={featured} practiceRepoName={PRACTICE_REPO_NAME} />
            </div>
          ) : (
            <div className="relative h-105 w-full sm:h-130">
              <HeroCard3d member={featured} practiceRepoName={PRACTICE_REPO_NAME} />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
