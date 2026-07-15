"use client";

import { SpotlightCarousel } from "./spotlight-carousel";

import { Reveal } from "@/features/home";

/**
 * Self-contained "Member Spotlight" section for the home page: eyebrow label,
 * editorial heading, and the spotlight carousel — matching the other home
 * sections. Mount directly inside a `<section>` wrapper.
 *
 * @returns The spotlight section.
 * @example
 * <section className="w-full py-28 sm:py-44">
 *   <div className="mx-auto max-w-7xl px-4">
 *     <MembersSpotlightSection />
 *   </div>
 * </section>
 */
export const MembersSpotlightSection = () => (
  <div className="space-y-20">
    <Reveal>
      <p className="text-muted-foreground mb-8 font-mono text-xs tracking-[0.35em] uppercase">[ Member Spotlight ]</p>
      <h2 className="max-w-3xl text-4xl leading-tight font-medium text-balance sm:text-6xl">
        Meet the people you&apos;ll ship with.
      </h2>
    </Reveal>
    <Reveal delay={0.1}>
      <SpotlightCarousel />
    </Reveal>
  </div>
);
