import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { MemberProfile } from "./types";
import Image from "next/image";

const MAX_VISIBLE_SKILLS = 4;

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

/**
 * A member's public card: avatar, name, title, up to four skill chips (with a "+N"
 * overflow badge), experience badge, and an optional "View Portfolio" link.
 *
 * @param member - The profile to render.
 * @returns The member card.
 * @example
 * <MemberCard member={profile} />
 */
export const MemberCard = ({ member }: { member: MemberProfile }) => {
  const visibleSkills = member.skills.slice(0, MAX_VISIBLE_SKILLS);
  const overflowCount = member.skills.length - visibleSkills.length;

  return (
    <div className="group border-border relative h-80 w-full overflow-hidden rounded-xl border shadow-sm">
      {/* Avatar */}
      {member.avatarUrl ? (
        <Image alt={member.displayName} className="object-cover" fill sizes="100%" src={member.avatarUrl} />
      ) : (
        <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-4xl font-bold">
          {initialsOf(member.displayName)}
        </div>
      )}

      {/* Gradient overlay always visible at bottom */}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-4 pt-10 pb-3">
        <p className="truncate text-lg font-semibold text-white">{member.displayName}</p>
      </div>

      {/* Hover panel */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/85 p-4 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
        <p className="truncate text-base font-semibold text-white">{member.displayName}</p>
        <p className="text-sm text-white/70">{member.title}</p>

        {member.bio && <p className="mt-2 line-clamp-2 text-xs text-white/60">{member.bio}</p>}

        {member.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {visibleSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {overflowCount > 0 && (
              <Badge variant="outline" className="text-xs text-white/70">
                +{overflowCount}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <Badge className="text-xs">{member.experience}</Badge>
          {member.portfolioUrl && (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-7 gap-1 px-2 text-xs text-white hover:bg-white/20 hover:text-white"
            >
              <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer">
                Portfolio <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
