import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

type AuthedRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const inflight = new Map<string, Promise<unknown>>();

function dedupe<T>(key: string, factory: () => Promise<T>): Promise<T> {
  if (inflight.has(key)) return inflight.get(key) as Promise<T>;
  const promise = factory().finally(() => inflight.delete(key));
  inflight.set(key, promise);
  return promise;
}

export const client: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config: AuthedRequest) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error?.response?.data ?? error);
  },
);

export const http = {
  get: <T>(url: string, params?: object) => client.get<T>(url, { params }).then((r) => r.data),
  post: <T>(url: string, data?: unknown) =>
    dedupe(`POST:${url}:${JSON.stringify(data ?? "")}`, () => client.post<T>(url, data).then((r) => r.data)),
  put: <T>(url: string, data?: unknown) =>
    dedupe(`PUT:${url}:${JSON.stringify(data ?? "")}`, () => client.put<T>(url, data).then((r) => r.data)),
  patch: <T>(url: string, data?: unknown) =>
    dedupe(`PATCH:${url}:${JSON.stringify(data ?? "")}`, () => client.patch<T>(url, data).then((r) => r.data)),
  delete: <T>(url: string, params?: object) => client.delete<T>(url, { params }).then((r) => r.data),
};
