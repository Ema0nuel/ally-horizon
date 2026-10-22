"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Subtle entrance animation (opacity + translateY) for page content.
 * Uses CSS (off the main thread) and respects prefers-reduced-motion via the
 * global override. `delay` is used for staggered entrances.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("animate-fade-in-up", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
