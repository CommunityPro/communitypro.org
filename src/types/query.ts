import type { QueryKey, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { PaginatedResponse } from "./app";

export interface OptimisticConfig<TCache, TVariables> {
  updater: (current: TCache | undefined, variables: TVariables) => TCache;
  rollback?: (current: TCache | undefined, variables: TVariables) => TCache;
}

export interface MutationConfig<TData, TVariables = object, TCache = unknown> {
  method: "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  invalidates?: QueryKey[] | ((data: TData) => QueryKey[]);
  optimistic?: OptimisticConfig<TCache, TVariables>;
  optimisticQueryKey?: QueryKey[];
  transform?: (raw: unknown) => TData;
}

export type MutationReturn<TData, TVariables> = UseMutationResult<TData, Error, TVariables> & {
  kind: "mutation";
};

export interface PaginatedQueryConfig<TData, TParams extends object = object> {
  params: TParams;
  url: string;
  enabled?: boolean;
  initialPage?: number;
  pageSize?: number;
  staleTime?: number;
  transform?: (raw: unknown) => TData;
}

export type PaginatedQueryReturn<TData> = UseQueryResult<PaginatedResponse<TData>, Error> & {
  kind: "paginated";
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
};

export interface QueryConfig<TData, TParams extends object = object> {
  params: TParams;
  url: string;
  enabled?: boolean;
  staleTime?: number;
  transform?: (raw: unknown) => TData;
}

export type QueryReturn<TData> = UseQueryResult<TData, Error> & {
  kind: "query";
};
