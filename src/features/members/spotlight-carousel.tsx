"use client";

import { MemberCard } from "./member-card";
import { useSpotlight } from "./hooks";

const SKELETON_COUNT = 4;

/**
 * Horizontal, scroll-snapping row of member cards for the home page spotlight section.
 * Shows skeleton placeholders while loading and renders nothing once loaded to an empty
 * list, so the section stays invisible pre-launch rather than showing an empty shell.
 *
 * @returns The spotlight carousel, or `null` while there are no members to show.
 * @example
 * <SpotlightCarousel />
 */
export const SpotlightCarousel = () => {
  const { data: members, isLoading } = useSpotlight();

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-hidden">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <div key={index} className="bg-muted h-64 w-72 shrink-0 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!members || members.length === 0) return null;

  return (
    <div className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {members.map((member) => (
        <div key={member.id} className="w-72 shrink-0 snap-start">
          <MemberCard member={member} />
        </div>
      ))}
    </div>
  );
};
