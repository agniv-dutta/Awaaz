import type { HTMLAttributes } from 'react';

export function Spinner({ style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      style={{
        display: 'inline-block',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '3px solid rgba(255,158,0,0.2)',
        borderTopColor: '#FF9E00',
        animation: 'spin 0.8s linear infinite',
        ...style,
      }}
      {...props}
    />
  )
}
