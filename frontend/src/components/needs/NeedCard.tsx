import type { Need } from '../../types'
import { C } from '../../utils/colors'

interface NeedCardProps {
  need: Need
  onDispatch?: (needId: string) => void
}

export function NeedCard({ need, onDispatch }: NeedCardProps) {
  const urgencyColor =
    need.urgency === 'CRITICAL' ? C.orange :
    need.urgency === 'HIGH' ? C.orangeDark :
    need.urgency === 'MEDIUM' ? C.violet :
    C.low

  const isViolet = need.urgency === 'MEDIUM'

  return (
    <div style={{
      background: 'rgba(26, 26, 26, 0.65)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 158, 0, 0.18)',
      borderLeft: `3px solid ${urgencyColor}`,
      borderRadius: '16px',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      {/* Left: badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Category badge */}
        <span style={{
          background: isViolet ? C.violetGhost : C.orangeGhost,
          color: isViolet ? C.violet : C.orange,
          border: `1px solid ${isViolet ? C.violetBorder : 'rgba(255,158,0,0.25)'}`,
          borderRadius: '6px',
          padding: '2px 8px',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase' as const,
        }}>
          {need.category}
        </span>

        {/* Urgency badge */}
        <span style={{
          background: urgencyColor + '22',
          color: urgencyColor,
          border: `1px solid ${urgencyColor}55`,
          borderRadius: '6px',
          padding: '2px 8px',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase' as const,
        }}>
          {need.urgency}
        </span>
      </div>

      {/* Center: ward name */}
      <span style={{
        fontSize: '14px',
        color: C.silver,
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        Ward {need.ward_id}
      </span>

      {/* Report count */}
      <span style={{
        fontSize: '12px',
        color: C.textMuted,
        flexShrink: 0,
        minWidth: '80px',
        textAlign: 'right',
      }}>
        {need.report_count} reports
      </span>

      {/* Dispatch button */}
      <button
        onClick={() => onDispatch?.(need.id)}
        style={{
          padding: '6px 16px',
          borderRadius: '8px',
          border: 'none',
          background: C.orange,
          color: '#1A1A1A',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background 0.15s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#E08800')}
        onMouseLeave={e => (e.currentTarget.style.background = C.orange)}
      >
        Dispatch →
      </button>
    </div>
  )
}
