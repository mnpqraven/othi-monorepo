import { PaginationState } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import Fuse, { FuseOptionKey } from "fuse.js";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeNewline(data?: string) {
  if (!data) return "";
  return data.replaceAll("\\n", "\n");
}

export const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
};

export function search<T>(
  data: T[],
  keys: FuseOptionKey<T>[],
  query: string | undefined
) {
  const fz = new Fuse(data, {
    keys,
    threshold: 0.4,
  });

  if (query?.length) return fz.search(query).map((e) => e.item);
  else return data;
}
