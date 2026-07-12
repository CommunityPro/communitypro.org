/** Normalized shape of an API failure, derived from backend ProblemDetails responses. */
export type ApiError = { status: number; code: string; message: string };

/**
 * Error thrown by `apiFetch` when the API responds with a non-2xx status.
 *
 * Carries the normalized `ApiError` fields so callers can branch on the stable
 * backend error code (e.g. `members.not_found`) or the HTTP status.
 *
 * @example
 * try {
 *   await apiFetch("/members/me");
 * } catch (error) {
 *   if (isApiError(error) && error.status === 401) redirectToSignIn();
 * }
 */
export class ApiRequestError extends Error implements ApiError {
  readonly status: number;
  readonly code: string;

  constructor({ status, code, message }: ApiError) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Type guard narrowing an unknown error to `ApiRequestError`.
 *
 * @param error - Any caught value.
 * @returns `true` when the value is an `ApiRequestError` thrown by `apiFetch`.
 * @example
 * const retry = (failureCount: number, error: unknown) =>
 *   !(isApiError(error) && error.status < 500) && failureCount < 2;
 */
export const isApiError = (error: unknown): error is ApiRequestError => error instanceof ApiRequestError;
