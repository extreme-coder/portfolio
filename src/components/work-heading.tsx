interface WorkHeadingProps {
  /** The second half of the title. Swaps with the active filter. */
  word: string;
}

/**
 * `WORK / INDEX.` — the trailing word tracks the active filter.
 *
 * The `key` is what drives the animation: changing the word remounts the span,
 * so the keyframe replays without any transition bookkeeping. The keyframe is a
 * left-to-right clip wipe (see `--animate-word-in`), and a
 * `prefers-reduced-motion` rule in globals.css flattens it to an instant swap.
 */
export function WorkHeading({ word }: WorkHeadingProps) {
  return (
    <div className="swiss-grid mb-16 md:mb-24">
      <h1 className="col-span-4 font-display text-display text-primary uppercase md:col-span-8 lg:col-span-10">
        Work{" "}
        <span aria-hidden="true" className="text-ink-dim">
          /
        </span>{" "}
        <span key={word} className="inline-block animate-word-in">
          {word}.
        </span>
      </h1>
    </div>
  );
}
