import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeReplace(
  str: string | undefined | null,
  search: string | RegExp,
  replace: string
): string {
  return str?.replace?.(search, replace) ?? str ?? '';
}
