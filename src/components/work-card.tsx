import { TagList } from "@/components/tag";
import { WorkFigure } from "@/components/work-figure";
import { cn } from "@/lib/cn";
import type { WorkEntry } from "@/lib/resume";
import { SHOW_WORK_IMAGES } from "@/lib/site";

interface WorkCardProps {
  entry: WorkEntry;
  /** Heading level, so the card fits the outline of whichever page renders it. */
  as?: "h2" | "h3";
  className?: string;
}

export function WorkCard({ entry, as: Heading = "h3", className }: WorkCardProps) {
  const kindLabel = entry.kind === "experience" ? "Experience" : "Project";

  return (
    <article
      className={cn(
        "group border border-line bg-surface-lowest p-6 transition-colors duration-300 hover:border-line-strong md:p-8",
        className,
      )}
    >
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-baseline">
        <div>
          <p
            className={cn(
              "label mb-2 flex flex-wrap items-center gap-x-3 gap-y-1",
              entry.kind === "experience" ? "text-accent" : "text-primary",
            )}
          >
            {kindLabel}
            {entry.inProgress ? (
              // Sits with the kind label rather than in the tag row: this is a
              // status, and the tag row is the Tech Stack facet on `/work`.
              <span className="inline-flex items-center gap-2 text-accent">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                In progress
              </span>
            ) : null}
          </p>
          <Heading className="font-display text-headline text-primary">{entry.title}</Heading>
          <p className="mt-1 text-body-lg text-ink-muted">{entry.subtitle}</p>
        </div>
        {entry.period ? (
          <p className="label-micro shrink-0 border border-line px-3 py-1 text-ink-dim">
            {entry.period}
          </p>
        ) : null}
      </div>

      <hr className="mb-6 border-t border-line" />

      <p className="text-body text-ink-muted">{entry.summary}</p>

      {entry.highlights.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-3 text-body text-ink-muted">
          {entry.highlights.map((highlight) => (
            <li
              key={highlight}
              className="relative pl-6 before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-ink-dim before:content-['']"
            >
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      {SHOW_WORK_IMAGES && entry.image ? (
        <WorkFigure image={entry.image} title={entry.title} />
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <TagList tags={entry.tags} label={`Technologies used in ${entry.title}`} />
        {entry.href ? (
          <a
            href={entry.href}
            target="_blank"
            rel="noreferrer noopener"
            className="label inline-flex items-center gap-2 text-primary transition-colors hover:text-accent"
          >
            <span>
              GitHub<span className="sr-only"> — {entry.title} (opens in a new tab)</span>
            </span>
            <ArrowUpRight />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
    >
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}
