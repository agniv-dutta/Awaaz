import type { HTMLAttributes } from 'react';
import { cn } from "../../utils/cn"

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "critical" | "high" | "medium" | "low" | "pending" | "accepted" | "in_progress" | "completed" | "declined" | "processed" | "flagged"
}

export function Badge({ className, variant = "low", ...props }: BadgeProps) {
  const variants = {
    critical: "bg-orange text-charcoal",
    high: "bg-orange-dark text-charcoal",
    medium: "bg-violet-ghost text-violet border border-violet-border",
    low: "bg-[#D9D9D915] text-silver border border-[#D9D9D940]",
    
    // Status variants
    pending: "border border-silver text-silver bg-transparent",
    accepted: "bg-violet-ghost text-violet border border-transparent",
    in_progress: "bg-orange-ghost text-orange border border-transparent",
    completed: "bg-transparent text-silver border border-silver opacity-50",
    declined: "bg-transparent text-[#EF4444] border border-[#EF4444] opacity-50",
    processed: "bg-violet-ghost text-violet border border-transparent",
    flagged: "bg-orange-ghost text-orange border border-transparent",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
