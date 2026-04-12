import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ style, onFocus, onBlur, ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={{
          display: 'flex',
          height: '40px',
          width: '100%',
          borderRadius: '8px',
          border: '1px solid rgba(255, 158, 0, 0.2)',
          background: 'rgba(26, 26, 26, 0.6)',
          padding: '0 12px',
          fontSize: '14px',
          color: '#FFFFFF',
          outline: 'none',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#FF9E00'
          onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 158, 0, 0.2)'
          onBlur?.(e)
        }}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
