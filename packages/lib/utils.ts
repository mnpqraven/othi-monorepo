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

export function* range(start: number, end: number, step = 1) {
  while (start <= end) {
    yield start;
    // eslint-disable-next-line no-param-reassign
    start += step;
  }
}

/**
 * This function removes trailing zeroes if it's a whole number (eg. 18.00)
 * Otherwise a float percent with n decimals is returned
 * @param fixed - amount of decimals, defaults to 2
 * undefined number will return '0 %'
 */
export function asPercentage(data: number | undefined, fixed?: number): string {
  if (!data) return "0 %";
  return `${Number(`${(data * 100).toFixed(fixed ?? 2)}`)} %`;
}

/**
 * If 2 Javascript Date objects has the same date, ignoring its hours,
 * minutes and seconds
 */
export function sameDate(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

/**
 * this function rotates your array and shift the elements around
 * @param by - number of rotations, positive number is clockwise (left shift),
 * negative number is ccw (right shift)
 * @param data - any abitrary array, if the array is empty then it's directly
 * returned
 * @returns rotated array
 */
export function rotate<T>(by: number, data: T[]): T[] {
  if (data.length === 0) return data;
  if (by === 0) return data;
  if (by < 0) {
    let temp = data;
    for (let index = 0; index < by * -1; index++) {
      temp.push(temp.shift()!);
    }
    return temp;
  }

  let temp = data;
  for (let index = 0; index < by; index++) {
    temp.unshift(temp.pop()!);
  }
  return temp;
}

export function isEmpty(value: unknown[] | string) {
  return value.length === 0;
}
