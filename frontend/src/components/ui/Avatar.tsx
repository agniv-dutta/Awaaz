import type { HTMLAttributes } from 'react';
import { C } from '../../utils/colors'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  initials: string
}

export function Avatar({ initials, style, ...props }: AvatarProps) {
  return (
    <div
      style={{
        display: 'flex',
        width: '40px',
        height: '40px',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: C.violetGhost,
        border: `1px solid ${C.violetBorder}`,
        color: C.violet,
        fontSize: '14px',
        fontWeight: 600,
        ...style,
      }}
      {...props}
    >
      {initials.substring(0, 2).toUpperCase()}
    </div>
  )
}
