import { cn } from "@/lib/cn";

interface TagProps {
  children: string;
  className?: string;
}

/** Read-only technology chip. */
export function Tag({ children, className }: TagProps) {
  return (
    <li
      className={cn(
        "label-micro border border-line px-2 py-1 text-ink-dim whitespace-nowrap",
        className,
      )}
    >
      {children}
    </li>
  );
}

interface TagListProps {
  tags: string[];
  label?: string;
  className?: string;
}

export function TagList({ tags, label = "Technologies", className }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </ul>
  );
}
