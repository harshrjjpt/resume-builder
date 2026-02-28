"use client";

import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  compact = false,
  light = false
}: {
  className?: string;
  compact?: boolean;
  light?: boolean;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <img src="/logo-mark.svg" alt="HireLoom" className={cn("h-6 w-6", light ? "brightness-0 invert" : "")} />
      {!compact ? (
        <span className={cn("font-semibold tracking-tight", light ? "text-white" : "text-foreground")}>
          HireLoom
        </span>
      ) : null}
    </div>
  );
}
