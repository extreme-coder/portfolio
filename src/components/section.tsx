import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Two-column editorial section: a letterspaced label in the left margin, content
 * on the right. The rule is drawn per column so the grid gutter stays visible —
 * a small Swiss-typography detail carried over from the design.
 */
export function Section({ id, label, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("swiss-grid scroll-mt-28", className)}>
      <div className="col-span-4 border-t border-line pt-4 md:col-span-2 lg:col-span-3">
        <h2 className="label text-ink-dim">{label}</h2>
      </div>
      <div className="col-span-4 border-t border-line pt-4 md:col-span-6 lg:col-span-9">
        {children}
      </div>
    </section>
  );
}
