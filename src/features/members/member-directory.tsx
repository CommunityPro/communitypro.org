"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EXPERIENCE_LEVELS, type ExperienceLevel } from "./types";
import { Pagination } from "@/components/shared/pagination";
import { useMemberSearch } from "./use-member-search";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemberCard } from "./member-card";
import { useDebounce } from "@/hooks";

const PAGE_SIZE = 12;
const MAX_SKILL_OPTIONS = 20;
const SYNC_DEBOUNCE_MS = 300;
const SKELETON_COUNT = PAGE_SIZE;

const isExperienceLevel = (value: string | null): value is ExperienceLevel =>
  value !== null && (EXPERIENCE_LEVELS as readonly string[]).includes(value);

const parsePage = (value: string | null): number => {
  const parsed = value ? Number.parseInt(value, 10) : 1;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

type DirectoryUrlState = {
  search: string;
  skills: string[];
  experience: ExperienceLevel | undefined;
  page: number;
};

const buildQueryString = (state: DirectoryUrlState): string => {
  const params = new URLSearchParams();
  if (state.search) params.set("q", state.search);
  if (state.skills.length > 0) params.set("skills", state.skills.join(","));
  if (state.experience) params.set("experience", state.experience);
  if (state.page > 1) params.set("page", String(state.page));
  return params.toString();
};

const SkeletonCard = () => (
  <div className="border-border-default bg-background flex h-56 flex-col gap-4 rounded-2xl border p-5">
    <div className="flex items-center gap-3">
      <div className="bg-muted size-11 shrink-0 animate-pulse rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
        <div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
      </div>
    </div>
    <div className="flex flex-wrap gap-1.5">
      <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
      <div className="bg-muted h-5 w-14 animate-pulse rounded-full" />
      <div className="bg-muted h-5 w-12 animate-pulse rounded-full" />
    </div>
    <div className="bg-muted mt-auto h-8 w-full animate-pulse rounded-full" />
  </div>
);

/**
 * The Members directory: a debounced search bar, skill/experience filter popovers with
 * removable chips, a responsive `MemberCard` grid (skeletons while loading, a friendly
 * empty state, and a degraded-mode note when the DB fallback is serving results), and
 * pagination. All filter state is synced to the URL (`q`, `skills`, `experience`, `page`)
 * so directory links are shareable and the back button works.
 *
 * Calls `useSearchParams`, so the caller must render it inside a `<Suspense>` boundary.
 *
 * @returns The full members directory UI.
 * @example
 * <Suspense fallback={<Loader />}>
 *   <MemberDirectory />
 * </Suspense>
 */
export const MemberDirectory = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState<string>(() => searchParams.get("q") ?? "");
  const [skills, setSkills] = useState<string[]>(() => {
    const raw = searchParams.get("skills");
    return raw ? raw.split(",").filter(Boolean) : [];
  });
  const [experience, setExperience] = useState<ExperienceLevel | undefined>(() => {
    const raw = searchParams.get("experience");
    return isExperienceLevel(raw) ? raw : undefined;
  });
  const [page, setPage] = useState<number>(() => parsePage(searchParams.get("page")));

  const debouncedSearch = useDebounce(searchInput, SYNC_DEBOUNCE_MS);

  // why: any filter change should land back on page 1; page-only changes must not retrigger
  // this (hence the separate effect + ref instead of folding page into the same dependency).
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally excludes `page`
  }, [debouncedSearch, experience, skills.join(",")]);

  useEffect(() => {
    const handle = setTimeout(() => {
      const query = buildQueryString({ search: searchInput, skills, experience, page });
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, SYNC_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [router, pathname, searchInput, skills, experience, page]);

  const filters = useMemo(
    () => ({ search: debouncedSearch || undefined, skills, experience, page, pageSize: PAGE_SIZE }),
    [debouncedSearch, skills, experience, page],
  );

  const { data, isLoading, isFetching } = useMemberSearch(filters);

  const skillOptions = useMemo(() => {
    const counts = data?.facets?.skills ?? {};
    const ranked = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_SKILL_OPTIONS)
      .map(([skill]) => skill);
    const combined = Array.from(new Set([...ranked, ...skills]));
    return combined.map((skill) => ({ skill, count: counts[skill] ?? 0 }));
  }, [data?.facets, skills]);

  const experienceCounts = data?.facets?.experience ?? {};

  const toggleSkill = (skill: string) => {
    setSkills((previous) =>
      previous.includes(skill) ? previous.filter((value) => value !== skill) : [...previous, skill],
    );
  };

  const selectExperience = (level: ExperienceLevel) => {
    setExperience((previous) => (previous === level ? undefined : level));
  };

  const hasActiveFilters = searchInput.length > 0 || skills.length > 0 || experience !== undefined;

  const clearAll = () => {
    setSearchInput("");
    setSkills([]);
    setExperience(undefined);
  };

  const items = data?.items ?? [];
  const showSkeleton = isLoading;
  const showEmpty = !isLoading && items.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputGroup className="sm:max-w-sm">
          <InputGroupInput
            aria-label="Search members"
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, title, or skill…"
            value={searchInput}
          />
          {isFetching && (
            <InputGroupAddon align="inline-end">
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
            </InputGroupAddon>
          )}
        </InputGroup>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                <SlidersHorizontal />
                Skill
                {skills.length > 0 && <Badge size="sm">{skills.length}</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="max-h-80 overflow-y-auto">
              {skillOptions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No skills to filter by yet.</p>
              ) : (
                <div className="space-y-1">
                  {skillOptions.map(({ skill, count }) => (
                    <label
                      className="hover:bg-muted flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm"
                      key={skill}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          checked={skills.includes(skill)}
                          className="accent-main size-4"
                          onChange={() => toggleSkill(skill)}
                          type="checkbox"
                        />
                        {skill}
                      </span>
                      {count > 0 && <span className="text-muted-foreground text-xs">{count}</span>}
                    </label>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline">
                <SlidersHorizontal />
                Experience
                {experience && <Badge size="sm">1</Badge>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56">
              <div className="space-y-1">
                {EXPERIENCE_LEVELS.map((level) => (
                  <label
                    className="hover:bg-muted flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm"
                    key={level}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        checked={experience === level}
                        className="accent-main size-4"
                        onChange={() => selectExperience(level)}
                        type="radio"
                      />
                      {level}
                    </span>
                    {experienceCounts[level] > 0 && (
                      <span className="text-muted-foreground text-xs">{experienceCounts[level]}</span>
                    )}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {skills.map((skill) => (
            <Badge className="gap-1" key={skill} variant="secondary">
              {skill}
              <button aria-label={`Remove ${skill} filter`} onClick={() => toggleSkill(skill)} type="button">
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {experience && (
            <Badge className="gap-1" variant="secondary">
              {experience}
              <button aria-label="Remove experience filter" onClick={() => setExperience(undefined)} type="button">
                <X className="size-3" />
              </button>
            </Badge>
          )}
          <Button onClick={clearAll} size="xs" variant="ghost">
            Clear all
          </Button>
        </div>
      )}

      {data?.source === "fallback" && (
        <p className="text-muted-foreground text-xs">Search is limited right now — showing best-effort results.</p>
      )}

      {showSkeleton ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : showEmpty ? (
        <div className="border-border-default flex flex-col items-center gap-3 rounded-2xl border p-12 text-center">
          <p className="font-semibold">No members match — try clearing filters.</p>
          {hasActiveFilters && (
            <Button onClick={clearAll} size="sm" variant="outline">
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}

      {!showSkeleton && !showEmpty && (data?.total ?? 0) > PAGE_SIZE && (
        <Pagination onPageChange={setPage} page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} />
      )}
    </div>
  );
};
