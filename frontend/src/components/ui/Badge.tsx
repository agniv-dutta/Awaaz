import type { HTMLAttributes } from 'react';
import { C } from '../../utils/colors'

export type BadgeVariant = 'orange' | 'violet' | 'silver' | 'green' | 'red';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  orange: { background: 'rgba(255,158,0,0.15)', color: '#FF9E00', border: '1px solid rgba(255,158,0,0.35)' },
  violet: { background: 'rgba(199,125,255,0.12)', color: '#C77DFF', border: '1px solid rgba(199,125,255,0.3)' },
  silver: { background: 'rgba(217,217,217,0.08)', color: '#D9D9D9', border: '1px solid rgba(217,217,217,0.2)' },
  green:  { background: 'rgba(74,222,128,0.1)',   color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' },
  red:    { background: 'rgba(248,113,113,0.1)',  color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' },
}

export function Badge({ variant = 'silver', style, ...props }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '20px',
        padding: '2px 10px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    />
  )
}
