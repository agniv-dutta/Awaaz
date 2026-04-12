import type { HTMLAttributes } from 'react';
import { cn } from "../../utils/cn"

export function Spinner({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-solid border-orange border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
        className
      )}
      role="status"
      {...props}
    />
  )
}
