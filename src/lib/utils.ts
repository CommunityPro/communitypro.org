import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalize(path: string): string {
  if (!path) return "";
  const clean = path.replace(/[?#].*$/, "");
  if (clean.length <= 3) return clean;
  const [a, b] = clean.replace(/^\//, "").split("/").filter(Boolean);
  if (!a) return "";
  return b ? `/${a}/${b}` : `/${a}`;
}

export function removeNullOrUndefined<T extends object>(values: T): T {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== null && value !== undefined)) as T;
}
