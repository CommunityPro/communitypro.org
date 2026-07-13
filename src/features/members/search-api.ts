import { getSearchToken, invalidateSearchToken } from "./search-token";
import type { MemberProfile } from "./types";
import { apiFetch } from "@/lib/api";

/** The Phase 2 `MemberProfile` shape as indexed in Meilisearch, plus a sortable join timestamp. */
export type MemberDocument = MemberProfile & { joinedAtUnix: number };

/** Query params accepted by `searchMembers`. */
export type MemberSearchParams = {
  query?: string;
  skills?: string[];
  experience?: string;
  page: number;
  pageSize: number;
};

/** Facet counts returned alongside search results, keyed by facet value. */
export type MemberSearchFacets = {
  skills: Record<string, number>;
  experience: Record<string, number>;
};

/** Normalized result shape shared by the Meilisearch and DB-fallback code paths. */
export type MemberSearchResult = {
  items: MemberProfile[];
  total: number;
  facets: MemberSearchFacets | null;
  /** Which backend served this result — the UI surfaces a degraded-mode note on `"fallback"`. */
  source: "search" | "fallback";
};

type MeilisearchResponse = {
  hits: MemberDocument[];
  estimatedTotalHits: number;
  facetDistribution?: MemberSearchFacets;
};

type MembersListResponse = {
  items: MemberProfile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// why: Meilisearch filter expressions quote string values with single quotes — escape any
// embedded backslash/quote so a skill like "O'Reilly's Toolkit" can't break the expression.
const escapeFilterValue = (value: string): string => value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

const buildFilters = (params: Pick<MemberSearchParams, "skills" | "experience">): string[] => {
  const filters = (params.skills ?? []).map((skill) => `skills = '${escapeFilterValue(skill)}'`);
  if (params.experience) filters.push(`experience = '${escapeFilterValue(params.experience)}'`);
  return filters;
};

const toMemberProfile = ({ joinedAtUnix: _joinedAtUnix, ...profile }: MemberDocument): MemberProfile => profile;

const searchViaMeilisearch = async (
  host: string,
  token: string,
  params: MemberSearchParams,
): Promise<MemberSearchResult> => {
  const body: Record<string, unknown> = {
    q: params.query ?? "",
    filter: buildFilters(params),
    facets: ["skills", "experience"],
    limit: params.pageSize,
    offset: (params.page - 1) * params.pageSize,
  };
  // why: sorting by recency only makes sense with no search text — relevance should win
  // once the visitor is actually searching.
  if (!params.query) body.sort = ["joinedAtUnix:desc"];

  const response = await fetch(`${host}/indexes/members/search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Meilisearch search failed with status ${response.status}`);

  const result = (await response.json()) as MeilisearchResponse;
  return {
    items: result.hits.map(toMemberProfile),
    total: result.estimatedTotalHits,
    facets: result.facetDistribution ?? null,
    source: "search",
  };
};

const searchViaFallback = async (params: MemberSearchParams): Promise<MemberSearchResult> => {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("pageSize", String(params.pageSize));
  if (params.query) query.set("search", params.query);
  if (params.experience) query.set("experience", params.experience);

  // why: the DB fallback only accepts a single `skill` param — send the first and filter
  // the rest client-side within the returned page (imperfect, but acceptable degradation).
  const [firstSkill, ...restSkills] = params.skills ?? [];
  if (firstSkill) query.set("skill", firstSkill);

  const response = await apiFetch<MembersListResponse>(`/members?${query.toString()}`);
  const items =
    restSkills.length > 0
      ? response.items.filter((member) => restSkills.every((skill) => member.skills.includes(skill)))
      : response.items;

  return { items, total: response.total, facets: null, source: "fallback" };
};

/**
 * Searches the members directory: uses a scoped Meilisearch token when one is available
 * (relevance-ranked, faceted, filterable by skill/experience), and falls back to the
 * paginated `GET /members` endpoint when search is unavailable. If the Meilisearch call
 * itself fails (network error, expired/invalid token), the cached token is invalidated and
 * the request retried once before falling back to the DB endpoint.
 *
 * @param params - Query text, selected skills/experience, and pagination.
 * @returns Normalized results with a `source` flag (`"search"` or `"fallback"`).
 * @example
 * const { items, total, facets, source } = await searchMembers({
 *   query: "react",
 *   skills: ["TypeScript"],
 *   page: 1,
 *   pageSize: 12,
 * });
 */
export const searchMembers = async (params: MemberSearchParams): Promise<MemberSearchResult> => {
  const token = await getSearchToken();
  if (!token) return searchViaFallback(params);

  try {
    return await searchViaMeilisearch(token.host, token.token, params);
  } catch {
    invalidateSearchToken();
    const retryToken = await getSearchToken();
    if (!retryToken) return searchViaFallback(params);

    try {
      return await searchViaMeilisearch(retryToken.host, retryToken.token, params);
    } catch {
      return searchViaFallback(params);
    }
  }
};
