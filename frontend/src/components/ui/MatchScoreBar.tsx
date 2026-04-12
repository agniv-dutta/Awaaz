import type { HTMLAttributes } from 'react';
import { C } from '../../utils/colors'

interface MatchScoreBarProps extends HTMLAttributes<HTMLDivElement> {
  score: number // 0 to 1
}

export function MatchScoreBar({ score, style, ...props }: MatchScoreBarProps) {
  const percentage = Math.max(0, Math.min(1, score)) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '140px', ...style }} {...props}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '11px', color: C.textMuted }}>{Math.round(percentage)}% Match</span>
      </div>
      <div style={{
        height: '4px',
        width: '100%',
        borderRadius: '2px',
        background: 'rgba(255,158,0,0.12)',
        overflow: 'hidden',
      }}>
        <div
          style={{
            height: '100%',
            borderRadius: '2px',
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${C.orange}, ${C.violet})`,
          }}
        />
      </div>
    </div>
  )
}
