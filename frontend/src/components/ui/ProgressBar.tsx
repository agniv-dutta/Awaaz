import type { HTMLAttributes } from 'react';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  progress: number // 0 to 1
}

export function ProgressBar({ progress, style, ...props }: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(1, progress)) * 100
  return (
    <div
      style={{
        height: '4px',
        width: '100%',
        borderRadius: '2px',
        background: 'rgba(255,158,0,0.12)',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          height: '100%',
          borderRadius: '2px',
          background: '#FF9E00',
          width: `${percentage}%`,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  )
}
