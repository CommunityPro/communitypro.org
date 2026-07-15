"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./reveal";

import type { Contributor, OrgMember } from "@/features/github";

type CommunityProps = {
  contributors: Contributor[];
  wall: OrgMember[];
};

const MarqueeRow = ({ members, reverse }: { members: OrgMember[]; reverse?: boolean }) => (
  <div className="overflow-hidden">
    <div className={`marquee-track flex gap-4 ${reverse ? "marquee-track-reverse" : ""}`}>
      {[...members, ...members].map((member, index) => (
        <Link
          aria-hidden={index >= members.length || undefined}
          className="shrink-0 transition-transform duration-300 hover:-translate-y-1"
          href={member.htmlUrl}
          key={`${member.login}-${index}`}
          rel="noopener noreferrer"
          tabIndex={index >= members.length ? -1 : undefined}
          target="_blank"
          title={member.login}
        >
          <Image
            alt={index >= members.length ? "" : member.login}
            className="border-border-default size-14 rounded-full border grayscale transition-all duration-300 hover:grayscale-0"
            height={56}
            src={member.avatarUrl}
            width={56}
          />
        </Link>
      ))}
    </div>
  </div>
);

/**
 * The community proof section: top practice-repo contributors as a ranked podium
 * plus list, and an infinite two-row marquee of real member avatars linking to
 * their GitHub profiles.
 *
 * @param contributors - Ranked contributors from getHomeData.
 * @param wall - Org members for the avatar marquee.
 * @returns The community section.
 * @example
 * <Community contributors={data.contributors} wall={data.wall} />
 */
export const Community = ({ contributors, wall }: CommunityProps) => {
  const podium = contributors.slice(0, 3);
  const runnersUp = contributors.slice(3, 10);
  const firstRow = wall.slice(0, Math.ceil(wall.length / 2));
  const secondRow = wall.slice(Math.ceil(wall.length / 2));

  return (
    <div className="space-y-24">
      <div className="space-y-20">
        <Reveal>
          <p className="text-muted-foreground mb-8 font-mono text-xs tracking-[0.35em] uppercase">[ Contributors ]</p>
          <h2 className="max-w-3xl text-4xl leading-tight font-medium text-balance sm:text-6xl">
            Built by the people in it.
          </h2>
        </Reveal>
        {podium.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-3">
            {podium.map((contributor, index) => (
              <Reveal delay={index * 0.08} key={contributor.login}>
                <Link
                  className="border-border-default bg-surface group flex h-full flex-col gap-y-6 rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  href={contributor.htmlUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="flex items-start justify-between">
                    <Image
                      alt={contributor.name ?? contributor.login}
                      className="size-16 rounded-full"
                      height={64}
                      src={contributor.avatarUrl}
                      width={64}
                    />
                    <span className="text-muted-foreground font-mono text-xs">#{index + 1}</span>
                  </div>
                  <div className="mt-auto space-y-1">
                    <p className="text-xl font-medium">{contributor.name ?? contributor.login}</p>
                    <p className="text-muted-foreground font-mono text-xs">@{contributor.login}</p>
                  </div>
                  <p className="font-mono text-sm">
                    <span className="bg-main rounded-full px-2.5 py-1 font-semibold text-black">
                      {contributor.contributions}
                    </span>
                    <span className="text-muted-foreground ml-2.5">merged PRs</span>
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
        {runnersUp.length > 0 && (
          <Reveal>
            <ol className="border-border-default divide-border-default divide-y border-t">
              {runnersUp.map((contributor, index) => (
                <li key={contributor.login}>
                  <Link
                    className="group flex items-center gap-x-6 py-4"
                    href={contributor.htmlUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="text-muted-foreground w-8 font-mono text-xs">
                      {String(index + 4).padStart(2, "0")}
                    </span>
                    <Image
                      alt={contributor.name ?? contributor.login}
                      className="size-9 rounded-full"
                      height={36}
                      src={contributor.avatarUrl}
                      width={36}
                    />
                    <span className="font-medium group-hover:underline group-hover:underline-offset-4">
                      {contributor.name ?? contributor.login}
                    </span>
                    <span className="text-muted-foreground ml-auto font-mono text-xs">
                      {contributor.contributions} merged
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </Reveal>
        )}
      </div>
      {wall.length > 6 && (
        <div className="space-y-4">
          <MarqueeRow members={firstRow} />
          <MarqueeRow members={secondRow} reverse />
        </div>
      )}
    </div>
  );
};
