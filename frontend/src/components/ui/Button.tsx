import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[8px] px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange disabled:opacity-50 disabled:pointer-events-none",
          variant === 'primary' && "bg-orange text-charcoal hover:bg-orange-dark",
          variant === 'secondary' && "bg-transparent border border-charcoal-border text-silver hover:bg-charcoal",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
