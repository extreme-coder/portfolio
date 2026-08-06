"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { WorkCard } from "@/components/work-card";
import { WorkHeading } from "@/components/work-heading";
import { cn } from "@/lib/cn";
import type { WorkEntry, WorkKind } from "@/lib/resume";

type View = "all" | "projects" | "experience";
type Sort = "date" | "name";

const VIEWS: { value: View; label: string }[] = [
  { value: "all", label: "All" },
  { value: "projects", label: "Projects" },
  { value: "experience", label: "Experience" },
];

/** Second half of the page title, per filter. */
const HEADING_WORD: Record<View, string> = {
  all: "Index",
  projects: "Projects",
  experience: "Experience",
};

const SORTS: { value: Sort; label: string }[] = [
  { value: "date", label: "Date (Newest)" },
  { value: "name", label: "Name (A–Z)" },
];

/**
 * Delay added per tag as the available/unavailable dim crosses the list. With
 * 34 tags and a 500ms fade, the whole sweep lands around 900ms: slow enough to
 * read as a sweep, short enough not to feel sluggish. Adding tags lengthens it —
 * past roughly 40 the stagger wants to come down.
 */
const TAG_STAGGER_MS = 12;

const VIEW_KIND: Record<Exclude<View, "all">, WorkKind> = {
  projects: "project",
  experience: "experience",
};

function parseView(value: string | null): View {
  return value === "projects" || value === "experience" || value === "all" ? value : "all";
}

function parseSort(value: string | null): Sort {
  return value === "name" ? "name" : "date";
}

function parseTags(value: string | null, known: string[]): string[] {
  if (!value) return [];
  const wanted = new Set(value.split(",").map((tag) => tag.trim()));
  // Filter against the known list so a hand-edited URL can't inject junk.
  return known.filter((tag) => wanted.has(tag));
}

interface WorkBrowserProps {
  entries: WorkEntry[];
  tags: string[];
}

export function WorkBrowser({ entries, tags }: WorkBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the single source of truth, not a copy of local state. That
  // keeps every filter combination addressable, and it means a header link to
  // `?view=experience` retargets the page even when it is already mounted —
  // which state seeded once on mount could never see.
  const view = parseView(searchParams.get("view"));
  const sort = parseSort(searchParams.get("sort"));
  const selectedTags = useMemo(
    () => parseTags(searchParams.get("tags"), tags),
    [searchParams, tags],
  );

  const commit = useCallback(
    (next: { view?: View; sort?: Sort; tags?: string[] }) => {
      const nextView = next.view ?? view;
      const nextSort = next.sort ?? sort;
      let nextTags = next.tags ?? selectedTags;

      if (next.view !== undefined) {
        // Drop tags that don't exist in the new view, otherwise the list
        // silently empties out.
        const available = new Set(
          entries
            .filter((entry) => nextView === "all" || entry.kind === VIEW_KIND[nextView])
            .flatMap((entry) => entry.tags),
        );
        nextTags = nextTags.filter((tag) => available.has(tag));
      }

      const params = new URLSearchParams();
      if (nextView !== "all") params.set("view", nextView);
      if (nextTags.length > 0) params.set("tags", nextTags.join(","));
      if (nextSort !== "date") params.set("sort", nextSort);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [view, sort, selectedTags, entries, pathname, router],
  );

  const inView = useMemo(
    () => entries.filter((entry) => view === "all" || entry.kind === VIEW_KIND[view]),
    [entries, view],
  );

  // A tag that can't match anything in the current view is offered as disabled
  // rather than hidden, so the stack list doesn't reflow as you filter.
  const availableTags = useMemo(
    () => new Set(inView.flatMap((entry) => entry.tags)),
    [inView],
  );

  const results = useMemo(() => {
    const filtered =
      selectedTags.length === 0
        ? inView
        : inView.filter((entry) => entry.tags.some((tag) => selectedTags.includes(tag)));

    return [...filtered].sort((a, b) =>
      sort === "name"
        ? a.title.localeCompare(b.title)
        : b.sortKey - a.sortKey || a.rank - b.rank,
    );
  }, [inView, selectedTags, sort]);

  const changeView = useCallback((next: View) => commit({ view: next }), [commit]);

  const setSort = useCallback((next: Sort) => commit({ sort: next }), [commit]);

  const toggleTag = useCallback(
    (tag: string) =>
      commit({
        tags: selectedTags.includes(tag)
          ? selectedTags.filter((item) => item !== tag)
          : [...selectedTags, tag],
      }),
    [commit, selectedTags],
  );

  const reset = useCallback(
    () => commit({ view: "all", sort: "date", tags: [] }),
    [commit],
  );

  const isFiltered = view !== "all" || selectedTags.length > 0;

  return (
    <>
      <WorkHeading word={HEADING_WORD[view]} />

      <div className="swiss-grid items-start gap-y-12">
        <aside className="col-span-4 flex flex-col gap-10 md:col-span-8 lg:sticky lg:top-28 lg:col-span-3">
          <fieldset className="flex flex-col gap-4">
            <legend className="label mb-4 w-full border-b border-line pb-2 text-ink-dim">
              Filter
            </legend>
            <div className="flex flex-col gap-2">
              {VIEWS.map((option) => (
                <label key={option.value} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    name="view"
                    value={option.value}
                    checked={view === option.value}
                    onChange={() => changeView(option.value)}
                    className="peer sr-only"
                  />
                  <span className="label block border border-transparent px-4 py-2 text-ink-muted transition-colors peer-checked:border-line peer-checked:text-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-line hover:text-primary">
                    {option.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-4 size-1.5 -translate-y-1/2 rounded-full bg-accent opacity-0 transition-opacity peer-checked:opacity-100"
                  />
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-4">
            <h2 className="label w-full border-b border-line pb-2 text-ink-dim">Tech Stack</h2>
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag, index) => {
                const isSelected = selectedTags.includes(tag);
                const isAvailable = availableTags.has(tag);
                return (
                  <li key={tag}>
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-pressed={isSelected}
                      disabled={!isAvailable}
                      // Per-property delays, in the same order as the
                      // `transition-property` list below. Only opacity is
                      // staggered, so the dim sweeps down the list the way the
                      // heading wipes across, rather than every chip blinking at
                      // once — and hover still responds with no lag.
                      style={{
                        transitionDelay: `0ms, 0ms, 0ms, ${index * TAG_STAGGER_MS}ms`,
                      }}
                      className={cn(
                        // `transition-colors` omits opacity, which left the dim
                        // snapping while the borders eased.
                        "label-micro border px-3 py-1 transition-[color,background-color,border-color,opacity] duration-500 ease-in-out",
                        isSelected
                          ? "border-accent bg-accent text-on-accent"
                          : "border-line text-ink-muted hover:border-primary hover:text-primary",
                        !isAvailable && "cursor-not-allowed opacity-30 hover:border-line",
                      )}
                    >
                      {tag}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <fieldset className="flex flex-col gap-4">
            <legend className="label mb-4 w-full border-b border-line pb-2 text-ink-dim">
              Sort
            </legend>
            <div className="flex flex-col gap-3">
              {SORTS.map((option) => (
                <label
                  key={option.value}
                  className="label flex cursor-pointer items-center gap-3 text-ink-muted transition-colors has-checked:text-primary hover:text-primary"
                >
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sort === option.value}
                    onChange={() => setSort(option.value)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 rounded-full border border-line-strong transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        </aside>

        <div className="col-span-4 flex flex-col gap-8 md:col-span-8 lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <p role="status" className="label text-ink-dim">
              {results.length} {results.length === 1 ? "entry" : "entries"}
              {isFiltered ? ` of ${entries.length}` : ""}
            </p>
            {isFiltered ? (
              <button
                type="button"
                onClick={reset}
                className="label text-ink-muted underline underline-offset-4 transition-colors hover:text-primary"
              >
                Reset filters
              </button>
            ) : null}
          </div>

          <h2 className="sr-only">Results</h2>

          {results.length > 0 ? (
            <ul className="flex flex-col gap-8 md:gap-12">
              {results.map((entry) => (
                <li key={entry.id}>
                  <WorkCard entry={entry} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="border border-line p-8 md:p-12">
              <p className="font-display text-headline text-primary">Nothing matches that.</p>
              <p className="mt-3 text-body text-ink-muted">
                Try a different combination, or reset the filters to see everything.
              </p>
              <button
                type="button"
                onClick={reset}
                className="label mt-6 inline-flex border border-line-strong px-6 py-3 text-primary transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
