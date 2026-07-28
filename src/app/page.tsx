import Link from "next/link";
import { Container } from "@/components/container";
import { CopyEmailLink } from "@/components/copy-email-link";
import { Section } from "@/components/section";
import { TagList } from "@/components/tag";
import { WorkCard } from "@/components/work-card";
import {
  awards,
  basics,
  education,
  experience,
  featuredProjects,
  formatRange,
  skills,
} from "@/lib/resume";
import { siteUrl } from "@/lib/site";

const primaryEducation = education[0];

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />

      <Container className="pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="swiss-grid">
          {/* `w-fit` keeps the box tight to the longest line, so the wipe ends
              at the type rather than running on across the empty column. */}
          <h1 className="col-span-4 w-fit animate-title-in font-display text-display text-primary uppercase md:col-span-8 lg:col-span-11">
            {basics.headline}
          </h1>
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row md:mt-20">
          <Link
            href="/work?view=projects"
            className="label bg-primary px-8 py-4 text-center text-on-primary transition-colors hover:bg-accent hover:text-on-accent"
          >
            Projects
          </Link>
          <Link
            href="/work?view=experience"
            className="label border border-line px-8 py-4 text-center text-primary transition-colors hover:border-accent hover:text-accent"
          >
            Experience
          </Link>
        </div>

        <p className="label-micro mt-12 text-ink-dim">
          {basics.location}
          {primaryEducation
            ? ` — ${primaryEducation.credential}, ${primaryEducation.institution}`
            : ""}
        </p>
      </Container>

      <Container className="flex flex-col gap-24 pb-32 md:gap-32">
        <Section id="about" label="About">
          <p className="max-w-3xl font-display text-headline text-primary">{basics.summary}</p>
          <div className="mt-8 flex max-w-2xl flex-col gap-4 text-body-lg text-ink-muted">
            {basics.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Section>

        <Section id="projects" label="Selected Work">
          <ul className="flex flex-col gap-8 md:gap-12">
            {featuredProjects.map((project) => (
              <li key={project.id}>
                <WorkCard entry={project} />
              </li>
            ))}
          </ul>
          <Link
            href="/work"
            className="label mt-10 inline-flex border border-line px-6 py-3 text-primary transition-colors hover:border-accent hover:text-accent"
          >
            Browse the full chronicle
          </Link>
        </Section>

        <Section id="experience" label="Experience">
          <ul className="flex flex-col">
            {experience.map((role) => (
              <li
                key={role.id}
                className="flex flex-col gap-4 border-b border-line py-8 first:pt-0 last:border-b-0 md:flex-row md:items-start md:justify-between md:gap-12"
              >
                <div className="max-w-2xl">
                  <h3 className="font-display text-title text-primary">{role.role}</h3>
                  <p className="mt-1 text-body-lg text-ink-muted">
                    {role.organization} · {role.location}
                  </p>
                  <p className="mt-3 text-body text-ink-muted">{role.summary}</p>
                  <TagList
                    tags={role.tags}
                    label={`Technologies used at ${role.organization}`}
                    className="mt-5"
                  />
                </div>
                <p className="label-micro shrink-0 text-ink-dim md:text-right">
                  {formatRange(role.start, role.end)}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="stack" label="Stack">
          <dl className="flex flex-col">
            {skills.map((group) => (
              <div
                key={group.category}
                className="flex flex-col gap-4 border-b border-line py-6 first:pt-0 last:border-b-0 md:flex-row md:gap-12"
              >
                <dt className="label shrink-0 text-primary md:w-52">{group.category}</dt>
                <dd className="text-body-lg text-ink-muted">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="recognition" label="Recognition">
          <ul className="flex flex-col">
            {awards.map((award) => (
              <li
                key={award.id}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-5 first:pt-0 last:border-b-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-display text-title text-primary">{award.title}</h3>
                  <p className="text-body text-ink-muted">{award.result}</p>
                </div>
                <p className="label-micro text-ink-dim">{award.year}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="education" label="Education">
          <ul className="flex flex-col">
            {education.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-2 border-b border-line py-6 first:pt-0 last:border-b-0 md:flex-row md:items-start md:justify-between md:gap-12"
              >
                <div>
                  <h3 className="font-display text-title text-primary">{item.institution}</h3>
                  <p className="mt-1 text-body-lg text-ink-muted">
                    {item.credential}
                    {item.focus ? ` (${item.focus})` : ""}
                  </p>
                </div>
                <p className="label-micro flex shrink-0 flex-wrap gap-x-2 text-ink-dim md:flex-col md:items-end md:gap-y-1">
                  <span>{item.location}</span>
                  <span>{formatRange(item.start, item.end)}</span>
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="contact" label="Contact">
          <p className="max-w-2xl font-display text-headline text-primary">
            Open to internships and collaborations in machine learning and full-stack
            engineering. The fastest way to reach me is email.
          </p>
          <CopyEmailLink
            email={basics.email}
            className="mt-8 inline-block font-display text-display-sm break-all text-primary transition-colors hover:text-accent"
          />
          <ul className="mt-10 flex flex-wrap gap-4">
            {basics.profiles
              .filter((profile) => profile.network !== "Email")
              .map((profile) => (
                <li key={profile.network}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label inline-flex border border-line px-6 py-3 text-primary transition-colors hover:border-accent hover:text-accent"
                  >
                    {profile.network}
                  </a>
                </li>
              ))}
            <li>
              <a
                href={basics.resumeUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="label inline-flex border border-line px-6 py-3 text-primary transition-colors hover:border-accent hover:text-accent"
              >
                Download Résumé
              </a>
            </li>
          </ul>
        </Section>
      </Container>
    </>
  );
}

function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: basics.name,
    jobTitle: basics.role,
    email: `mailto:${basics.email}`,
    telephone: basics.phone,
    url: siteUrl,
    description: basics.summary,
    address: { "@type": "PostalAddress", addressLocality: basics.location },
    alumniOf: education.map((item) => ({
      "@type": "CollegeOrUniversity",
      name: item.institution,
    })),
    knowsAbout: skills.flatMap((group) => group.items),
    sameAs: basics.profiles
      .filter((profile) => profile.url.startsWith("http"))
      .map((profile) => profile.url),
  };

  return (
    <script
      type="application/ld+json"
      // Content is built from local, validated data — no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
