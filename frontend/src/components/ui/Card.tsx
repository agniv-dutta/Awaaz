import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        background: 'rgba(26, 26, 26, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 158, 0, 0.18)',
        borderRadius: '16px',
        ...style,
      }}
      {...props}
    />
  )
)
Card.displayName = 'Card'
