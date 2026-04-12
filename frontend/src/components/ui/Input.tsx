import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from "../../utils/cn"

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-[8px] border border-charcoal-border bg-charcoal px-3 py-2 text-sm text-silver ring-offset-charcoal file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-silver-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
