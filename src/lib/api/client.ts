import { env } from "@/lib/env";
import { ApiRequestError } from "./errors";
import { getAccessToken } from "./token";

type ProblemDetails = {
  status?: number;
  title?: string;
  detail?: string;
  code?: string;
};

const readProblemDetails = (body: unknown): ProblemDetails => {
  if (typeof body !== "object" || body === null) return {};
  const record = body as Record<string, unknown>;
  return {
    status: typeof record.status === "number" ? record.status : undefined,
    title: typeof record.title === "string" ? record.title : undefined,
    detail: typeof record.detail === "string" ? record.detail : undefined,
    code: typeof record.code === "string" ? record.code : undefined,
  };
};

const toApiRequestError = async (response: Response): Promise<ApiRequestError> => {
  let problem: ProblemDetails = {};
  try {
    problem = readProblemDetails(await response.json());
  } catch {
    // why: error bodies aren't guaranteed to be JSON (proxies, gateways, plain-text 502s).
  }
  return new ApiRequestError({
    status: problem.status ?? response.status,
    code: problem.code ?? `http_${response.status}`,
    message:
      problem.detail ?? problem.title ?? (response.statusText || `Request failed with status ${response.status}`),
  });
};

/**
 * Typed fetch wrapper for the Community Pro API: prefixes `NEXT_PUBLIC_API_URL`,
 * attaches a bearer token when one is available, sends/parses JSON, and normalizes
 * ProblemDetails failures into a thrown `ApiRequestError`.
 *
 * @param path - API path starting with `/`, e.g. `/members/spotlight`.
 * @param init - Standard `RequestInit`; pass `body` as a JSON string (`Content-Type` defaults to JSON).
 * @returns The parsed JSON response body typed as `T` (`undefined` for empty/204 responses).
 * @example
 * const spotlight = await apiFetch<MemberCardData[]>("/members/spotlight");
 * const updated = await apiFetch<MemberProfile>("/members/me", {
 *   method: "PUT",
 *   body: JSON.stringify({ displayName: "Ada Lovelace" }),
 * });
 */
export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = await getAccessToken();
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.body !== undefined && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${env.apiUrl}${path}`, { ...init, headers });
  if (!response.ok) throw await toApiRequestError(response);

  const text = await response.text();
  // why: 204s and empty bodies would make response.json() throw.
  return (text.length > 0 ? JSON.parse(text) : undefined) as T;
};
