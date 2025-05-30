import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Types
import type { ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
