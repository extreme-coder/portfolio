import resumeJson from "@data/resume.json";
import {
  resumeSchema,
  type Experience,
  type Project,
  type Resume,
  type WorkImage,
} from "./schema";

const parsed = resumeSchema.safeParse(resumeJson);

if (!parsed.success) {
  throw new Error(
    `data/resume.json is invalid:\n${parsed.error.issues
      .map((issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n")}`,
  );
}

export const resume: Resume = parsed.data;
export const { basics, education, experience, projects, skills, awards } = resume;

/* -------------------------------------------------------------------------- */
/* Dates                                                                       */
/* -------------------------------------------------------------------------- */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Formats a `YYYY-MM` string as `Jun 2024` without going through `Date` (no timezone drift). */
export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  const label = MONTHS[Number(month) - 1];
  return label && year ? `${label} ${year}` : yearMonth;
}

/** `Jun 2024 — Apr 2025`, or `Sept 2024 — Present` while ongoing. */
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : "Present"}`;
}

/** Sortable integer for a `YYYY-MM` string: `2024-06` → `202406`. */
function monthKey(yearMonth: string): number {
  return Number(yearMonth.replace("-", ""));
}

/* -------------------------------------------------------------------------- */
/* Work entries — experience and projects in one browsable list                 */
/* -------------------------------------------------------------------------- */

export type WorkKind = "experience" | "project";

export interface WorkEntry {
  id: string;
  kind: WorkKind;
  /** Primary line: a job title, or a project name. */
  title: string;
  /** Secondary line: `Medivizor · Remote`, or a project tagline. */
  subtitle: string;
  /** Badge in the top-right of a card: `Jun 2024 — Apr 2025`, or `2023`. */
  period: string | null;
  summary: string;
  highlights: string[];
  tags: string[];
  /** Screenshot or figure, when the entry has one. */
  image?: WorkImage;
  href: string | null;
  /** Descending-sort key. Undated projects sort last. */
  sortKey: number;
  /** Position in `resume.json`, used to break sort ties in the author's own order. */
  rank: number;
}

function fromExperience(item: Experience, index: number): WorkEntry {
  return {
    id: item.id,
    kind: "experience",
    title: item.role,
    subtitle: `${item.organization} · ${item.location}`,
    period: formatRange(item.start, item.end),
    summary: item.summary,
    highlights: item.highlights,
    tags: item.tags,
    image: item.image,
    href: null,
    // Ongoing roles sort above everything finished.
    sortKey: item.end ? monthKey(item.end) : Number.MAX_SAFE_INTEGER,
    rank: index,
  };
}

function fromProject(item: Project, index: number): WorkEntry {
  return {
    id: item.id,
    kind: "project",
    title: item.name,
    subtitle: item.tagline,
    period: item.date ? formatMonth(item.date) : null,
    summary: item.description,
    highlights: item.highlights,
    tags: item.tags,
    image: item.image,
    href: item.url,
    // Undated projects sort to the bottom of a date sort, but keep their resume
    // order among themselves rather than falling back to alphabetical.
    sortKey: item.date ? monthKey(item.date) : 0,
    rank: experience.length + index,
  };
}

const experienceEntries = experience.map(fromExperience);
const projectEntries = projects.map(fromProject);

/** Every experience and project, newest first. */
export const workEntries: WorkEntry[] = [...experienceEntries, ...projectEntries].sort(
  (a, b) => b.sortKey - a.sortKey || a.rank - b.rank,
);

/** Distinct tags across all work, ordered by how often they appear then alphabetically. */
export const allTags: string[] = (() => {
  const counts = new Map<string, number>();
  for (const entry of workEntries) {
    for (const tag of entry.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort(([tagA, countA], [tagB, countB]) => countB - countA || tagA.localeCompare(tagB))
    .map(([tag]) => tag);
})();

/**
 * Projects in the order they appear on the resume — that ordering is a deliberate
 * statement of what matters most, so the landing page keeps it. `/work` is the
 * place for chronological sorting.
 */
export const featuredProjects: WorkEntry[] = projectEntries;

export const currentYear = new Date().getFullYear();
