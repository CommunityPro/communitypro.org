import { geocodeLocation } from "./geocode";

import type { Contributor, FeaturedMember, HomeData, MemberHub, OrgMember, OrgStats } from "./types";

const GITHUB_API = "https://api.github.com";
const ORG = process.env.NEXT_PUBLIC_GITHUB_ORG || "CommunityPro";
const PRACTICE_REPO = process.env.NEXT_PUBLIC_PRACTICE_REPO || "Practice-Contribution";
const REVALIDATE_SECONDS = 3600;
const LOCATION_PROFILE_LIMIT = 60;

type RawUser = {
  login: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  followers: number;
  avatar_url: string;
  html_url: string;
};

type RawMember = { login: string; avatar_url: string; html_url: string };
type RawContributor = { login: string; avatar_url: string; html_url: string; contributions: number };
type RawRepo = { name: string; stargazers_count: number; forks_count: number; html_url: string; fork: boolean };
type RawOrg = { followers: number; created_at: string; public_repos: number };

const headers = (): HeadersInit => ({
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_API_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}` } : {}),
});

const ghGet = async (path: string): Promise<Response | null> => {
  try {
    const res = await fetch(`${GITHUB_API}${path}`, { headers: headers(), next: { revalidate: REVALIDATE_SECONDS } });
    return res.ok ? res : null;
  } catch {
    return null;
  }
};

const ghJson = async <T>(path: string): Promise<T | null> => {
  const res = await ghGet(path);
  return res ? ((await res.json()) as T) : null;
};

// why: GitHub reports total org members nowhere; per_page=1 makes the Link header's
// rel="last" page number equal the member count for the price of one request.
const fetchMemberCount = async (): Promise<number | null> => {
  const res = await ghGet(`/orgs/${ORG}/members?per_page=1`);
  if (!res) return null;
  const link = res.headers.get("link");
  const match = link?.match(/[?&]page=(\d+)>; rel="last"/);
  return match ? Number(match[1]) : null;
};

const fetchUsers = async (logins: string[]): Promise<Map<string, RawUser>> => {
  const users = await Promise.all(logins.map((login) => ghJson<RawUser>(`/users/${login}`)));
  const map = new Map<string, RawUser>();
  users.forEach((user) => {
    if (user) map.set(user.login, user);
  });
  return map;
};

const buildHubs = (profiles: Iterable<RawUser>): MemberHub[] => {
  const hubs = new Map<string, MemberHub>();
  for (const profile of profiles) {
    const geo = geocodeLocation(profile.location);
    if (!geo) continue;
    const existing = hubs.get(geo.label);
    if (existing) existing.members += 1;
    else hubs.set(geo.label, { label: geo.label, country: geo.country, lat: geo.lat, lng: geo.lng, members: 1 });
  }
  return [...hubs.values()].sort((a, b) => b.members - a.members);
};

/**
 * Aggregates everything the home page shows from the GitHub org: live stats,
 * top contributors of the practice repo, an avatar wall, the featured member for
 * the hero card, and geocoded member hubs for the globe. Every call is cached with
 * ISR (1h) and every failure degrades to null/empty so the page renders offline.
 *
 * @returns Home page data sourced exclusively from the GitHub org.
 * @example
 * const data = await getHomeData(); // in a server component
 */
export const getHomeData = async (): Promise<HomeData> => {
  const [org, memberCount, repos, members, rawContributors] = await Promise.all([
    ghJson<RawOrg>(`/orgs/${ORG}`),
    fetchMemberCount(),
    ghJson<RawRepo[]>(`/orgs/${ORG}/repos?per_page=100`),
    ghJson<RawMember[]>(`/orgs/${ORG}/members?per_page=100`),
    ghJson<RawContributor[]>(`/repos/${ORG}/${PRACTICE_REPO}/contributors?per_page=12`),
  ]);

  const contributorLogins = (rawContributors ?? []).map((c) => c.login);
  const memberLogins = (members ?? []).slice(0, LOCATION_PROFILE_LIMIT).map((m) => m.login);
  const profileLogins = [...new Set([...contributorLogins, ...memberLogins])];
  const profiles = await fetchUsers(profileLogins);

  const stats: OrgStats | null =
    org && repos
      ? {
          members: memberCount ?? members?.length ?? 0,
          publicRepos: org.public_repos,
          stars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
          forks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
          followers: org.followers,
          foundedYear: new Date(org.created_at).getFullYear(),
        }
      : null;

  const contributors: Contributor[] = (rawContributors ?? []).map((c) => ({
    login: c.login,
    name: profiles.get(c.login)?.name ?? null,
    avatarUrl: c.avatar_url,
    htmlUrl: c.html_url,
    contributions: c.contributions,
  }));

  const top = contributors[0];
  const topProfile = top ? profiles.get(top.login) : undefined;
  const featured: FeaturedMember | null =
    top && topProfile
      ? { ...top, bio: topProfile.bio, followers: topProfile.followers, location: topProfile.location }
      : null;

  const wall: OrgMember[] = (members ?? []).map((m) => ({
    login: m.login,
    avatarUrl: m.avatar_url,
    htmlUrl: m.html_url,
  }));

  const practice = (repos ?? []).find((repo) => repo.name === PRACTICE_REPO);

  return {
    stats,
    wall,
    contributors,
    featured,
    hubs: buildHubs(profiles.values()),
    practiceRepo: practice
      ? { forks: practice.forks_count, stars: practice.stargazers_count, url: practice.html_url }
      : null,
  };
};
