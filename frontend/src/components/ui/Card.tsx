import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        background: 'rgba(10, 7, 4, 0.78)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 158, 0, 0.14)',
        borderRadius: '16px',
        ...style,
      }}
      {...props}
    />
  )
)
Card.displayName = 'Card'
