import type { HTMLAttributes } from 'react';
import { C } from '../../utils/colors'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'critical' | 'high' | 'medium' | 'low' | 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined' | 'processed' | 'flagged' | 'silver'
}

const variantStyles: Record<string, React.CSSProperties> = {
  critical:    { background: C.orange, color: '#1A1A1A' },
  high:        { background: C.orangeDark, color: '#1A1A1A' },
  medium:      { background: C.violetGhost, color: C.violet, border: `1px solid ${C.violetBorder}` },
  low:         { background: 'rgba(217, 217, 217, 0.08)', color: '#D9D9D9', border: '1px solid rgba(217, 217, 217, 0.2)' },
  pending:     { background: 'rgba(217, 217, 217, 0.08)', color: '#D9D9D9', border: '1px solid rgba(217, 217, 217, 0.2)' },
  accepted:    { background: C.violetGhost, color: C.violet, border: '1px solid transparent' },
  in_progress: { background: C.orangeGhost, color: C.orange, border: '1px solid transparent' },
  completed:   { background: 'rgba(217, 217, 217, 0.06)', color: 'rgba(217, 217, 217, 0.4)', border: '1px solid rgba(217, 217, 217, 0.1)' },
  declined:    { background: 'rgba(220, 50, 50, 0.08)', color: 'rgba(220, 100, 100, 0.7)', border: '1px solid rgba(220, 50, 50, 0.2)' },
  processed:   { background: C.violetGhost, color: C.violet, border: '1px solid transparent' },
  flagged:     { background: C.orangeGhost, color: C.orange, border: '1px solid transparent' },
  silver:      { background: 'rgba(217, 217, 217, 0.08)', color: '#D9D9D9', border: '1px solid rgba(217, 217, 217, 0.2)' },
}

export function Badge({ variant = 'low', style, ...props }: BadgeProps) {
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
