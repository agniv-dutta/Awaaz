import { NavLink } from 'react-router-dom'
import { BarChart3, LayoutDashboard, Map, FileText, Users, Truck } from 'lucide-react'
import { C } from '../../utils/colors'

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Needs Map', path: '/map', icon: Map },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Volunteers', path: '/volunteers', icon: Users },
  { name: 'Dispatch', path: '/dispatch', icon: Truck },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
]

export function Sidebar() {
  return (
    <div style={{
      width: '240px',
      background: 'rgba(26, 26, 26, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 158, 0, 0.15)',
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
        borderBottom: '1px solid rgba(255, 158, 0, 0.12)',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '24px',
          fontWeight: 600,
          color: C.orange,
          letterSpacing: '-0.5px',
          display: 'block',
          lineHeight: 1,
        }}>
          Awaaz
        </span>
        <div style={{
          fontSize: '11px',
          color: 'rgba(217, 217, 217, 0.5)',
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
                background: isActive ? 'rgba(255, 158, 0, 0.15)' : 'transparent',
                color: isActive ? C.orange : 'rgba(217, 217, 217, 0.55)',
                border: isActive ? '1px solid rgba(255, 158, 0, 0.25)' : '1px solid transparent',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                if (!el.getAttribute('aria-current')) {
                  el.style.background = 'rgba(255, 158, 0, 0.08)'
                  el.style.color = '#D9D9D9'
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                if (!el.getAttribute('aria-current')) {
                  el.style.background = 'transparent'
                  el.style.color = 'rgba(217, 217, 217, 0.55)'
                }
              }}
            >
              <Icon size={16} color="currentColor" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
