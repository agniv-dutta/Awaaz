import { C } from '../../utils/colors'
import { useAuthStore } from '../../store/authStore'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  const { user } = useAuthStore()
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD'

  return (
    <header style={{
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      borderBottom: '1px solid rgba(255, 158, 0, 0.10)',
      background: 'rgba(26, 26, 26, 0.5)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <h1 style={{ fontSize: '18px', fontWeight: 500, color: C.textPrimary, margin: 0 }}>
        {title}
      </h1>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: C.violetGhost,
        border: `1px solid ${C.violetBorder}`,
        color: C.violet,
        fontSize: '14px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        userSelect: 'none',
      }}>
        {initials}
      </div>
    </header>
  )
}
