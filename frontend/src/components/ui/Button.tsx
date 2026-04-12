import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', style, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      padding: '8px 18px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      outline: 'none',
      fontFamily: 'inherit',
    }

    const primary: React.CSSProperties = {
      ...base,
      background: '#FF9E00',
      color: '#1A1A1A',
      border: 'none',
    }

    const secondary: React.CSSProperties = {
      ...base,
      background: 'transparent',
      color: '#D9D9D9',
      border: '1px solid rgba(255, 158, 0, 0.25)',
    }

    const computed = variant === 'primary' ? primary : secondary

    return (
      <button
        ref={ref}
        style={{ ...computed, ...style }}
        onMouseEnter={(e) => {
          if (variant === 'primary') e.currentTarget.style.background = '#E08800'
          else e.currentTarget.style.background = 'rgba(255,158,0,0.08)'
          onMouseEnter?.(e)
        }}
        onMouseLeave={(e) => {
          if (variant === 'primary') e.currentTarget.style.background = '#FF9E00'
          else e.currentTarget.style.background = 'transparent'
          onMouseLeave?.(e)
        }}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
