"use client";

import { SpotlightCarousel } from "./spotlight-carousel";

/**
 * Self-contained "Member Spotlight" section for the home page: heading plus the
 * spotlight carousel. Mount directly inside a `<section>` wrapper.
 *
 * @returns The spotlight section.
 * @example
 * <section className="py-5 sm:py-10">
 *   <div className="mx-auto max-w-7xl space-y-4">
 *     <MembersSpotlightSection />
 *   </div>
 * </section>
 */
export const MembersSpotlightSection = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-medium sm:text-4xl">Member Spotlight</h2>
    <SpotlightCarousel />
  </div>
);
