"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkImage } from "@/lib/schema";

interface WorkFigureProps {
  image: WorkImage;
  /** Entry title, used to name the control for screen readers. */
  title: string;
}

/**
 * A thumbnail that opens the full image in a modal.
 *
 * Uses a native `<dialog>`, so Escape-to-close and the focus trap come from the
 * platform rather than from hand-rolled key handling. The full-size image is
 * only mounted once the dialog opens, so cards don't pay for it on page load.
 */
export function WorkFigure({ image, title }: WorkFigureProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => {
    setOpen(true);
    dialogRef.current?.showModal();
  }, []);

  // `close` also fires on Escape, so this keeps state in sync with the element.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // The page behind a modal dialog still scrolls; hold it still while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        aria-label={`Expand figure for ${title}`}
        className="group/figure mt-8 flex items-center gap-4 text-left"
      >
        <span className="block border border-line bg-white transition-colors group-hover/figure:border-accent">
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes="240px"
            className="h-16 w-auto max-w-48 object-contain"
          />
        </span>
        <span className="label-micro flex items-center gap-1.5 text-ink-dim transition-colors group-hover/figure:text-accent">
          Expand
          <ExpandIcon />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`Figure for ${title}`}
        onClick={(event) => {
          // Clicks land on the dialog itself only when they hit the backdrop.
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto max-h-[92vh] max-w-[min(92vw,80rem)] bg-transparent p-0 backdrop:bg-black/85"
      >
        {open ? (
          <figure className="flex max-h-[92vh] flex-col border border-line bg-surface">
            <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-3">
              <figcaption className="label-micro text-ink-dim">{title}</figcaption>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="label-micro -my-1 -mr-2 px-2 py-1 text-ink-muted transition-colors hover:text-accent"
              >
                Close
              </button>
            </div>
            {/* min-h-0 lets this shrink inside the flex column so a tall image
                scales down to fit instead of pushing the dialog off-screen. */}
            <div className="flex min-h-0 flex-1 justify-center overflow-auto bg-white">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="(min-width: 1280px) 80rem, 92vw"
                className="h-auto max-h-full w-auto max-w-full object-contain"
              />
            </div>
          </figure>
        ) : null}
      </dialog>
    </>
  );
}

function ExpandIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
    >
      <path d="M9.5 2H14v4.5M6.5 14H2V9.5M14 2l-5 5M2 14l5-5" />
    </svg>
  );
}
