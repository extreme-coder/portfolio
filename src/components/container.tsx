import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Centred page column: 1440px max, 20/40px gutters. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-page px-edge", className)}>{children}</div>;
}
