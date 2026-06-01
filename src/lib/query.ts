"use client";

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { http } from "./client";
import type {
  MutationConfig,
  MutationReturn,
  PaginatedQueryConfig,
  PaginatedQueryReturn,
  PaginatedResponse,
  QueryConfig,
  QueryReturn,
} from "@/types";
import { removeNullOrUndefined } from "./utils";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 3,
        retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 30_000),
        staleTime: 30_000,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

const fetcher = async <TData, TParams extends object = object>(
  url: string,
  params?: TParams,
  transform?: (raw: unknown) => TData,
): Promise<TData> => {
  const raw = await http.get<TData>(url, { params });
  return transform ? transform(raw) : (raw as TData);
};

const mutator = async <TData, TVariables extends object = object>(
  method: "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  variables: TVariables,
  transform?: (raw: unknown) => TData,
): Promise<TData> => {
  const raw = await http[method.toLowerCase() as "post" | "put" | "delete" | "patch"](url, variables);
  return transform ? transform(raw) : (raw as TData);
};

export const useApiMutation = <TData, TVariables extends object = object, TCache = unknown>(
  config: MutationConfig<TData, TVariables, TCache>,
): MutationReturn<TData, TVariables> => {
  const queryClient = makeQueryClient();

  const result = useMutation({
    mutationFn: (variables: TVariables) =>
      mutator<TData, TVariables>(config.method, config.url, variables, config.transform),
    onMutate: async (variables) => {
      if (!config.optimistic || !config.optimisticQueryKey) return;
      await queryClient.cancelQueries({ queryKey: config.optimisticQueryKey });
      const snapshot = queryClient.getQueryData<TCache>(config.optimisticQueryKey);
      queryClient.setQueryData<TCache>(config.optimisticQueryKey, (current) =>
        config.optimistic!.updater(current, variables),
      );
      return snapshot;
    },
    onError: (_, variables, context) => {
      if (config.optimistic && config.optimisticQueryKey) {
        const ctx = context as { snapshot: TCache } | undefined;
        queryClient.setQueryData<TCache>(
          config.optimisticQueryKey,
          config.optimistic.rollback
            ? (current) => config.optimistic!.rollback!(current, variables)
            : () => ctx?.snapshot,
        );
      }
    },
    onSuccess: (data) => {
      const keys = typeof config.invalidates === "function" ? config.invalidates(data) : (config.invalidates ?? []);
      keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key as readonly unknown[] }));
    },
  });

  return { ...result, kind: "mutation" };
};

export const useApiQuery = <TData, TParams extends object = object>(
  config: QueryConfig<TData, TParams>,
): QueryReturn<TData> => {
  const _params = removeNullOrUndefined(config.params || {});

  const result = useQuery<TData, Error>({
    queryKey: [config.url, JSON.stringify(_params)],
    queryFn: () => fetcher(config.url, { params: { ..._params } }),
    enabled: config.enabled || true,
    staleTime: 30_000,
  });

  return { ...result, kind: "query" };
};

export const useApiPaginatedQuery = <TData, TParams extends object = object>(
  config: PaginatedQueryConfig<TData, TParams>,
): PaginatedQueryReturn<TData> => {
  const [pageSize, setPageSize] = useState(config.pageSize || 10);
  const [page, setPage] = useState(config.initialPage || 1);
  const _params = removeNullOrUndefined(config.params || {});

  const result = useQuery<PaginatedResponse<TData>, Error>({
    queryKey: [config.url, JSON.stringify(_params), { page, pageSize }],
    queryFn: () => http.get<PaginatedResponse<TData>>(config.url, { params: { ..._params, page, pageSize } }),
    staleTime: 30_000,
    enabled: config.enabled || true,
  });

  return { ...result, kind: "paginated", page, pageSize, setPage, setPageSize };
};
