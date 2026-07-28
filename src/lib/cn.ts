type ClassValue = string | false | null | undefined;

/** Joins conditional class names. Small enough not to warrant a dependency. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
