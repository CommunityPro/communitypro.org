import { ExternalLink } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { MemberProfile } from "./types";

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
    <div className="border-border-default bg-background flex h-full w-full flex-col gap-4 rounded-2xl border p-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          {member.avatarUrl && <AvatarImage src={member.avatarUrl} alt={member.displayName} />}
          <AvatarFallback>{initialsOf(member.displayName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold">{member.displayName}</p>
          <p className="text-muted-foreground truncate text-sm">{member.title}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline">{member.experience}</Badge>
        {visibleSkills.map((skill) => (
          <Badge key={skill} variant="secondary">
            {skill}
          </Badge>
        ))}
        {overflowCount > 0 && <Badge variant="ghost">+{overflowCount}</Badge>}
      </div>

      {member.portfolioUrl && (
        <Button asChild variant="outline" size="sm" className="mt-auto gap-1.5">
          <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer">
            View Portfolio
            <ExternalLink />
          </a>
        </Button>
      )}
    </div>
  );
};
