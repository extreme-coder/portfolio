import { basics } from "./resume";

/**
 * Set `NEXT_PUBLIC_SITE_URL` in the deployment environment (e.g. `https://aryansingh.ca`)
 * so canonical URLs, OpenGraph tags, and the sitemap point at the real origin.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const site = {
  url: siteUrl,
  title: `${basics.name} — ${basics.role}`,
  shortTitle: basics.name,
  description: basics.summary,
} as const;

/**
 * Screenshots on work cards are off while the presentation is being reworked.
 * Flip to `true` to bring them back — the images, their alt text, and the
 * expandable `WorkFigure` component are all still in place.
 *
 * Typed as `boolean` rather than inferred, so the disabled branch still
 * typechecks.
 */
export const SHOW_WORK_IMAGES: boolean = false;

export interface NavItem {
  label: string;
  href: string;
  /** Highlights on this route… */
  pathname?: string;
  /** …but only when `?view=` matches this. Omit to match the whole route. */
  view?: string;
  /** Highlights while this landing-page section is the one being read. */
  section?: string;
}

export const navItems: NavItem[] = [
  { label: "Projects", href: "/work?view=projects", pathname: "/work", view: "projects" },
  {
    label: "Experience",
    href: "/work?view=experience",
    pathname: "/work",
    view: "experience",
  },
  { label: "About", href: "/#about", section: "about" },
];

/** Landing-page sections the nav tracks while scrolling. */
export const navSections: string[] = navItems.flatMap((item) =>
  item.section ? [item.section] : [],
);

/** Trailing call to action. Sits at the end of the nav, in place of a plain link. */
export const navCta: NavItem = { label: "Connect", href: "/#contact" };
