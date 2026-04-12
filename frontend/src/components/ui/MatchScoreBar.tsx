import type { HTMLAttributes } from 'react';
import { cn } from "../../utils/cn"

interface MatchScoreBarProps extends HTMLAttributes<HTMLDivElement> {
  score: number // 0 to 1
}

export function MatchScoreBar({ score, className, ...props }: MatchScoreBarProps) {
  const percentage = Math.max(0, Math.min(1, score)) * 100
  
  return (
    <div className={cn("flex flex-col gap-1 w-[140px]", className)} {...props}>
      <div className="flex justify-end">
        <span className="text-[11px] text-silver-muted">{Math.round(percentage)}% Match</span>
      </div>
      <div className="h-1 w-full rounded-sm bg-charcoal-border overflow-hidden">
        <div 
          className="h-full rounded-sm bg-gradient-to-r from-orange to-violet" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
