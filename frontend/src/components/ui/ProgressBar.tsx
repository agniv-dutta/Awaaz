import type { HTMLAttributes } from 'react';
import { cn } from "../../utils/cn"

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  progress: number // 0 to 1
}

export function ProgressBar({ progress, className, ...props }: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(1, progress)) * 100
  return (
    <div className={cn("h-1 w-full rounded-sm bg-charcoal-border overflow-hidden", className)} {...props}>
      <div 
        className="h-full rounded-sm bg-orange transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
