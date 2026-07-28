import { z } from "zod";

/**
 * Runtime contract for `data/resume.json`.
 *
 * The JSON file is the single source of truth for every word on the site, so it
 * is validated once at module load: a typo in the data fails the build instead
 * of rendering an empty section.
 */

/** `YYYY-MM`, e.g. `2024-06`. */
const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "expected a YYYY-MM date");

/**
 * A screenshot or figure. `width`/`height` are the intrinsic pixel dimensions of
 * the file in `public/`; they reserve layout space so the card doesn't jump when
 * the image loads.
 */
const imageSchema = z.object({
  src: z.string().startsWith("/", "expected a path under public/"),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const profileSchema = z.object({
  network: z.string().min(1),
  handle: z.string().min(1),
  url: z.string().url(),
});

const basicsSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  headline: z.string().min(1),
  location: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  resumeUrl: z.string().min(1),
  summary: z.string().min(1),
  about: z.array(z.string().min(1)).min(1),
  profiles: z.array(profileSchema).min(1),
});

const educationSchema = z.object({
  id: z.string().min(1),
  institution: z.string().min(1),
  credential: z.string().min(1),
  focus: z.string().min(1).nullable(),
  location: z.string().min(1),
  start: yearMonth,
  /** `null` means ongoing. */
  end: yearMonth.nullable(),
});

const experienceSchema = z.object({
  id: z.string().min(1),
  organization: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  start: yearMonth,
  /** `null` means current. */
  end: yearMonth.nullable(),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string().min(1)).min(1),
  image: imageSchema.optional(),
});

const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  /** When it was built. `null` when the project has no single meaningful date. */
  date: yearMonth.nullable(),
  url: z.string().url().nullable(),
  description: z.string().min(1),
  highlights: z.array(z.string().min(1)),
  tags: z.array(z.string().min(1)).min(1),
  image: imageSchema.optional(),
});

const skillGroupSchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

const awardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  result: z.string().min(1),
  year: z.number().int().min(1970).max(2100),
});

export const resumeSchema = z.object({
  basics: basicsSchema,
  education: z.array(educationSchema).min(1),
  experience: z.array(experienceSchema).min(1),
  projects: z.array(projectSchema).min(1),
  skills: z.array(skillGroupSchema).min(1),
  awards: z.array(awardSchema).min(1),
});

export type Resume = z.infer<typeof resumeSchema>;
export type Basics = z.infer<typeof basicsSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Award = z.infer<typeof awardSchema>;
export type WorkImage = z.infer<typeof imageSchema>;
