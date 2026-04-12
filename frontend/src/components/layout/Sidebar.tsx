import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { BarChart3, LayoutDashboard, Map, FileText, Users, Truck } from 'lucide-react'

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Needs Map', path: '/map', icon: Map },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Volunteers', path: '/volunteers', icon: Users },
  { name: 'Dispatch', path: '/dispatch', icon: Truck },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
]

export function Sidebar() {
  const [sidebarMode, setSidebarMode] = useState<'dark' | 'light'>('dark')

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('awaaz-sidebar-mode') as 'dark' | 'light' | null
    if (saved) setSidebarMode(saved)
  }, [])

  // Save to localStorage when mode changes
  const toggleMode = (mode: 'dark' | 'light') => {
    setSidebarMode(mode)
    localStorage.setItem('awaaz-sidebar-mode', mode)
  }

  const isDark = sidebarMode === 'dark'
  const bgColor = isDark ? 'rgba(15, 10, 5, 0.92)' : '#D9D9D9'
  const borderColor = isDark ? 'rgba(255, 158, 0, 0.15)' : 'rgba(0, 0, 0, 0.1)'
  const textMuted = isDark ? 'rgba(217, 217, 217, 0.55)' : 'rgba(26, 26, 26, 0.55)'
  const activeItemBg = isDark ? 'rgba(255, 158, 0, 0.15)' : 'rgba(26, 26, 26, 0.12)'
  const activeItemColor = isDark ? '#FF9E00' : '#1A1A1A'
  const hoverBg = isDark ? 'rgba(255, 158, 0, 0.08)' : 'rgba(26, 26, 26, 0.08)'
  const logoColor = isDark ? '#FF9E00' : '#1A1A1A'
  const subtitleColor = isDark ? 'rgba(217, 217, 217, 0.4)' : 'rgba(26, 26, 26, 0.45)'

  return (
    <div style={{
      width: '240px',
      background: bgColor,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: `1px solid ${borderColor}`,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo section */}
      <div style={{
        height: '72px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 24px',
        borderBottom: `1px solid ${borderColor}`,
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '24px',
          fontWeight: 600,
          color: logoColor,
          letterSpacing: '-0.5px',
          display: 'block',
          lineHeight: 1,
        }}>
          Awaaz
        </span>
        <div style={{
          fontSize: '11px',
          color: subtitleColor,
          marginTop: '3px',
          letterSpacing: '0.02em',
        }}>
          Community Intelligence
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 0' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                margin: '2px 10px',
                borderRadius: '10px',
                background: isActive ? activeItemBg : 'transparent',
                color: isActive ? activeItemColor : textMuted,
                border: isDark
                  ? isActive ? '1px solid rgba(255, 158, 0, 0.25)' : '1px solid transparent'
                  : isActive ? '1px solid rgba(26, 26, 26, 0.2)' : '1px solid transparent',
                borderLeft: isDark ? '' : isActive ? '3px solid #1A1A1A' : '',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                if (!el.getAttribute('aria-current')) {
                  el.style.background = hoverBg
                  el.style.color = isDark ? '#FFFFFF' : '#1A1A1A'
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                if (!el.getAttribute('aria-current')) {
                  el.style.background = 'transparent'
                  el.style.color = textMuted
                }
              }}
            >
              <Icon size={16} color="currentColor" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* Mode toggle */}
      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${isDark ? 'rgba(255, 158, 0, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
      }}>
        <button
          onClick={() => toggleMode(isDark ? 'light' : 'dark')}
          style={{
            width: '100%',
            height: '36px',
            borderRadius: '8px',
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            background: isDark
              ? 'rgba(217, 217, 217, 0.08)'
              : 'rgba(26, 26, 26, 0.1)',
            border: isDark
              ? '1px solid rgba(217, 217, 217, 0.15)'
              : '1px solid rgba(26, 26, 26, 0.2)',
            color: isDark ? '#D9D9D9' : '#1A1A1A',
          }}
        >
          {isDark ? '☀ Light mode' : '☾ Dark mode'}
        </button>
      </div>
    </div>
  )
}
