import { Container } from "@/components/container";
import { basics, currentYear } from "@/lib/resume";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center md:py-16">
        <p className="font-display text-[clamp(1.375rem,3.5vw,2.25rem)] leading-none font-extrabold tracking-tighter text-primary uppercase">
          {basics.name}
        </p>

        <p className="label-micro text-ink-dim">
          © {currentYear} {basics.name}.
        </p>

        <ul className="flex flex-wrap gap-6">
          {basics.profiles.map((profile) => (
            <li key={profile.network}>
              <a
                href={profile.url}
                className="label-micro text-ink-muted underline underline-offset-4 transition-colors hover:text-primary"
                {...(profile.url.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
              >
                {profile.network}
              </a>
            </li>
          ))}
          <li>
            <a
              href={basics.resumeUrl}
              className="label-micro text-ink-muted underline underline-offset-4 transition-colors hover:text-primary"
              target="_blank"
              rel="noreferrer noopener"
            >
              Résumé (PDF)
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
