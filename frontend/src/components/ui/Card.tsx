import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from "../../utils/cn"

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[14px] border border-charcoal-border bg-charcoal-light",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"
