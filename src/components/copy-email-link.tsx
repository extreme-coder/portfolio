"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface CopyEmailLinkProps {
  email: string;
  className?: string;
}

/**
 * Renders the email as a real `mailto:` link — so it still works with
 * JavaScript disabled or if the Clipboard API is unavailable/denied — but on
 * click copies the address instead of opening a mail client, with a
 * screen-reader-announced confirmation.
 */
export function CopyEmailLink({ email, className }: CopyEmailLinkProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  async function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!navigator.clipboard) return; // no Clipboard API — let the mailto link fire

    event.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      aria-live="polite"
      className={cn(className, copied && "text-accent")}
    >
      {copied ? "Copied to clipboard" : email}
    </a>
  );
}
