"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { navItems, navSections, type NavItem } from "@/lib/site";

type Variant = "desktop" | "mobile";

/**
 * Tracks which landing-page section is currently being read.
 *
 * The root margin collapses the viewport to a band across its middle, so a
 * section counts as "current" once it reaches the middle of the screen rather
 * than the moment its top edge appears.
 */
function useActiveSection(enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || navSections.length === 0) {
      setActive(null);
      return;
    }

    const elements = navSections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Keep source order stable when several sections cross the band.
        setActive(navSections.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}

function isItemActive(
  item: NavItem,
  pathname: string,
  view: string | null,
  section: string | null,
): boolean {
  if (item.pathname && pathname === item.pathname) {
    // `?view=` is absent on the unfiltered index, where neither item is current.
    return item.view ? view === item.view : true;
  }
  if (item.section && pathname === "/") {
    return section === item.section;
  }
  return false;
}

interface NavLinksProps {
  variant: Variant;
  activeLabel: string | null;
}

function NavLinks({ variant, activeLabel }: NavLinksProps) {
  if (variant === "mobile") {
    return (
      <nav aria-label="Primary (mobile)" className="flex flex-col py-2">
        {navItems.map((item) => {
          const isActive = item.label === activeLabel;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "label border-b border-line py-4 transition-colors duration-240",
                isActive ? "text-primary" : "text-ink-muted hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
      {navItems.map((item) => {
        const isActive = item.label === activeLabel;
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? (item.section ? "true" : "page") : undefined}
            className={cn(
              "label relative pb-1 transition-colors duration-240",
              isActive ? "text-primary" : "text-ink-muted hover:text-primary",
            )}
          >
            {item.label}
            {/* Scaled from the left edge, linear — the same wipe as the heading,
                and it retracts the way it arrived. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 bottom-0 h-px origin-left bg-primary transition-transform duration-240 ease-linear",
                isActive ? "scale-x-100" : "scale-x-0",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}

function ActiveNavLinks({ variant }: { variant: Variant }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const section = useActiveSection(pathname === "/");

  const activeLabel =
    navItems.find((item) => isItemActive(item, pathname, view, section))?.label ?? null;

  return <NavLinks variant={variant} activeLabel={activeLabel} />;
}

/**
 * `useSearchParams` opts a client subtree out of prerendering, so the boundary
 * keeps it local: the nav ships in the static HTML with nothing marked current,
 * and the underline resolves on hydration.
 */
export function SiteNav({ variant }: { variant: Variant }) {
  return (
    <Suspense fallback={<NavLinks variant={variant} activeLabel={null} />}>
      <ActiveNavLinks variant={variant} />
    </Suspense>
  );
}
