"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

import { EASE_OUT, Reveal } from "./reveal";

import type { OrgStats } from "@/features/github";

const CountUp = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reducedMotion) {
      el.textContent = value.toLocaleString();
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        el.textContent = Math.round(latest).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [inView, reducedMotion, value]);

  return <span ref={ref}>0</span>;
};

/**
 * Live org numbers in an editorial row — every figure comes from the GitHub API
 * and counts up when scrolled into view. Renders nothing if stats are unavailable.
 *
 * @param stats - Org stats from getHomeData, or null.
 * @returns The stats strip, or null.
 * @example
 * <StatsStrip stats={data.stats} />
 */
export const StatsStrip = ({ stats }: { stats: OrgStats | null }) => {
  if (!stats) return null;

  const items = [
    { label: "Members on GitHub", value: stats.members },
    { label: "Open source repos", value: stats.publicRepos },
    { label: "Stars earned", value: stats.stars },
    { label: "Forks by builders", value: stats.forks },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-4">
      {items.map((item, index) => (
        <Reveal delay={index * 0.08} key={item.label}>
          <div className="flex flex-col items-center gap-y-3 text-center">
            <dd className="text-5xl font-medium tabular-nums sm:text-6xl">
              <CountUp value={item.value} />
            </dd>
            <dt className="text-muted-foreground font-mono text-xs tracking-widest uppercase">{item.label}</dt>
          </div>
        </Reveal>
      ))}
    </dl>
  );
};
