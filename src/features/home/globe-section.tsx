"use client";

import { useInView } from "framer-motion";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useRef } from "react";

import { Reveal } from "./reveal";

import type { MemberHub } from "@/features/github";

const MemberGlobe = dynamic(() => import("./member-globe"), { ssr: false });

/**
 * "Every timezone" section: a WebGL globe with pulsing markers on real member
 * hubs, beside a ranked list of the top cities. The canvas mounts lazily when the
 * section approaches the viewport; without hubs the section renders nothing.
 *
 * @param hubs - Geocoded member hubs from getHomeData.
 * @returns The globe section, or null when no hubs resolved.
 * @example
 * <GlobeSection hubs={data.hubs} />
 */
export const GlobeSection = ({ hubs }: { hubs: MemberHub[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const nearViewport = useInView(ref, { once: true, margin: "400px 0px" });
  const { resolvedTheme } = useTheme();

  if (hubs.length === 0) return null;

  const totalCountries = new Set(hubs.map((hub) => hub.country)).size;
  const topHubs = hubs.slice(0, 8);

  return (
    <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_1fr]" ref={ref}>
      <div aria-hidden className="relative order-last aspect-square w-full lg:order-first">
        <div className="bg-main/15 absolute inset-[12%] rounded-full blur-3xl" />
        {nearViewport && <MemberGlobe dotColor={resolvedTheme === "dark" ? "#5c594e" : "#b3ad9c"} hubs={hubs} />}
      </div>
      <div className="space-y-10">
        <Reveal>
          <p className="text-muted-foreground mb-8 font-mono text-xs tracking-[0.35em] uppercase">[ Everywhere ]</p>
          <h2 className="text-4xl leading-tight font-medium text-balance sm:text-6xl">
            One community, <span className="italic">every</span> timezone.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Members list {hubs.length} hubs across {totalCountries} countries on their GitHub profiles — whenever
            you&apos;re online, someone else is shipping too.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <ol className="border-border-default divide-border-default divide-y border-t">
            {topHubs.map((hub, index) => (
              <li className="flex items-baseline gap-x-6 py-4" key={hub.label}>
                <span className="text-muted-foreground w-8 font-mono text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-lg font-medium">
                  {hub.label}
                  <span className="text-muted-foreground ml-2 text-sm font-normal">{hub.country}</span>
                </span>
                <span className="text-muted-foreground ml-auto font-mono text-xs">
                  {hub.members} {hub.members === 1 ? "member" : "members"}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </div>
  );
};
