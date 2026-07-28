"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Container } from "@/components/container";
import { SiteNav } from "@/components/site-nav";
import { navCta } from "@/lib/site";

interface SiteHeaderProps {
  name: string;
}

export function SiteHeader({ name }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-6 md:h-24">
        <Link
          href="/"
          className="font-display text-[clamp(1.375rem,3.5vw,2.25rem)] leading-none font-extrabold tracking-tighter text-primary uppercase"
        >
          {name}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <SiteNav variant="desktop" />

          <Link
            href={navCta.href}
            className="label border border-line-strong px-6 py-2 text-primary transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
          >
            {navCta.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className="label -mr-2 px-2 py-2 text-primary md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </Container>

      <div
        id={menuId}
        hidden={!menuOpen}
        className="border-t border-line bg-surface-lowest md:hidden"
      >
        <Container>
          <SiteNav variant="mobile" />
          <Link
            href={navCta.href}
            className="label my-4 flex justify-center border border-line-strong px-6 py-3 text-primary transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
          >
            {navCta.label}
          </Link>
        </Container>
      </div>
    </header>
  );
}
