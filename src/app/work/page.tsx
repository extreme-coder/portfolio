import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { WorkBrowser } from "@/components/work-browser";
import { WorkCard } from "@/components/work-card";
import { WorkHeading } from "@/components/work-heading";
import { allTags, basics, workEntries } from "@/lib/resume";

export const metadata: Metadata = {
  title: "Work",
  description: `Projects and professional experience by ${basics.name} — filterable by discipline and technology.`,
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <Container className="pt-16 pb-32 md:pt-24">
      {/* The fallback is what gets prerendered, so the heading and the full list
          are in the static HTML for search engines and anyone without JavaScript. */}
      <Suspense fallback={<WorkFallback />}>
        <WorkBrowser entries={workEntries} tags={allTags} />
      </Suspense>
    </Container>
  );
}

function WorkFallback() {
  return (
    <>
      <WorkHeading word="Index" />
      <div className="swiss-grid">
        <ul className="col-span-4 flex flex-col gap-8 md:col-span-8 md:gap-12 lg:col-span-9 lg:col-start-4">
          {workEntries.map((entry) => (
            <li key={entry.id}>
              <WorkCard entry={entry} as="h2" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
