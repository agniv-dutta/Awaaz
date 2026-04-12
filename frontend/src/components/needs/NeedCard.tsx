import type { Need } from '../../types'
import { C } from '../../utils/colors'
import { Badge } from '../ui/Badge'

interface NeedCardProps {
  need: Need
  onDispatch?: (needId: string) => void
}

export function NeedCard({ need, onDispatch }: NeedCardProps) {
  const urgencyColor =
    need.urgency === 'CRITICAL' ? C.orange :
    need.urgency === 'HIGH' ? C.orangeDark :
    need.urgency === 'MEDIUM' ? C.violet :
    '#D9D9D9'

  const isViolet = need.category === 'MEDICAL' || need.category === 'MENTAL_HEALTH'
  const isSilver = need.category === 'SHELTER' || need.category === 'EDUCATION' || need.category === 'LEGAL' || need.category === 'OTHER'

  const badgeVariant = 
    need.urgency === 'CRITICAL' ? 'critical' :
    need.urgency === 'HIGH' ? 'high' :
    need.urgency === 'MEDIUM' ? 'medium' : 'low'

  return (
    <div 
      className="glass-card"
      style={{
        background: 'rgba(26, 26, 26, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 158, 0, 0.18)',
        borderLeft: `4px solid ${urgencyColor}`,
        borderRadius: '16px',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Left: badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Category badge */}
        <Badge variant={isSilver ? 'silver' : isViolet ? 'medium' : 'processed'}>
          {need.category}
        </Badge>

        {/* Urgency badge */}
        <Badge variant={badgeVariant}>
          {need.urgency}
        </Badge>
      </div>

      {/* Center: ward name */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>
          Ward {need.ward_id}
        </span>
        <span style={{ 
          fontSize: '13px', 
          color: '#D9D9D9', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap' 
        }}>
          {need.description}
        </span>
      </div>

      {/* Report count */}
      <span style={{
        fontSize: '12px',
        color: 'rgba(217, 217, 217, 0.5)',
        flexShrink: 0,
        minWidth: '80px',
        textAlign: 'right',
      }}>
        {need.report_count} reports
      </span>

      {/* Dispatch button */}
      <button
        onClick={() => onDispatch?.(need.id)}
        className="btn-primary-hover"
        style={{
          padding: '8px 18px',
          borderRadius: '8px',
          border: 'none',
          background: C.orange,
          color: '#1A1A1A',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background 0.15s ease',
          whiteSpace: 'nowrap',
        }}
      >
        Dispatch →
      </button>
    </div>
  )
}
