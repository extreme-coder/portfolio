import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <p className="label text-ink-dim">Error 404</p>
      <h1 className="mt-4 font-display text-display-sm text-primary uppercase">
        Page not found
      </h1>
      <p className="mt-6 max-w-xl text-body-lg text-ink-muted">
        That address doesn&rsquo;t resolve to anything. The work is still where it was.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="label bg-primary px-8 py-4 text-center text-on-primary transition-colors hover:bg-accent hover:text-on-accent"
        >
          Back home
        </Link>
        <Link
          href="/work"
          className="label border border-line px-8 py-4 text-center text-primary transition-colors hover:border-accent hover:text-accent"
        >
          View work
        </Link>
      </div>
    </Container>
  );
}
