"use client";

import { BadgeCheck, GitMerge, MapPin, Users } from "lucide-react";
import Image from "next/image";

import type { FeaturedMember } from "@/features/github";

type HeroCardFaceProps = {
  member: FeaturedMember;
  practiceRepoName: string;
};

/**
 * The DOM face of the hero member card — rendered flat as the reduced-motion
 * fallback and projected onto the WebGL card via drei's Html in the 3D version.
 * Everything shown is the featured member's real GitHub data.
 *
 * @param member - Top practice-repo contributor (from the GitHub API).
 * @param practiceRepoName - Name of the practice repo their PRs were merged into.
 * @returns The card face.
 * @example
 * <HeroCardFace member={featured} practiceRepoName="Practice-Contribution" />
 */
export const HeroCardFace = ({ member, practiceRepoName }: HeroCardFaceProps) => (
  <div className="flex w-80 flex-col gap-y-4 p-6 text-left">
    <div className="flex items-center gap-x-4">
      <Image alt={member.name ?? member.login} className="rounded-full" height={72} src={member.avatarUrl} width={72} />
      <div className="min-w-0">
        <p className="text-foreground truncate text-3xl font-semibold">{member.name ?? member.login}</p>
        <p className="text-muted-foreground truncate font-mono text-base">@{member.login}</p>
      </div>
    </div>
    {member.bio && <p className="text-muted-foreground text-lg leading-relaxed">{member.bio}</p>}
    <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-base">
      <span className="flex items-center gap-x-1.5">
        <Users className="size-5" />
        {member.followers.toLocaleString()} followers
      </span>
      {member.location && (
        <span className="flex items-center gap-x-1.5">
          <MapPin className="size-5" />
          {member.location}
        </span>
      )}
    </div>
    <hr />
    <div className="space-y-3 text-lg">
      <p className="text-muted-foreground flex items-center gap-x-2.5">
        <GitMerge className="size-6 shrink-0" />
        {member.contributions} merged PRs in {practiceRepoName}
      </p>
      <p className="text-foreground flex items-center gap-x-2.5 font-medium">
        <BadgeCheck className="fill-main size-6 shrink-0 text-black" />
        Top contributor — earned, not bought
      </p>
    </div>
  </div>
);
