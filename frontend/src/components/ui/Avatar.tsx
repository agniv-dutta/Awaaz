import type { HTMLAttributes } from 'react';
import { cn } from "../../utils/cn"

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  initials: string
}

export function Avatar({ initials, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C77DFF20] text-violet font-semibold text-sm",
        className
      )}
      {...props}
    >
      {initials.substring(0, 2).toUpperCase()}
    </div>
  )
}
