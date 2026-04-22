import type { Need } from '../../types'
import { C } from '../../utils/colors'
import { Badge } from '../ui/Badge'
import { CATEGORY_LABELS, URGENCY_LABELS } from '../../utils/labels'

interface NeedCardProps {
  need: Need & { ward_name?: string }
  onDispatch?: (needId: string) => void
  weatherCondition?: 'clear' | 'rain' | 'extreme_heat' | 'flood_risk' | 'storm'
}

export function NeedCard({ need, onDispatch, weatherCondition = 'clear' }: NeedCardProps) {
  const displayWard = (wardName: string) => {
    if (wardName && wardName.length === 36 && wardName.includes('-')) {
      return 'Mumbai Ward'
    }
    return wardName || 'Mumbai Ward'
  }

  const shouldPulseShelter = (weatherCondition === 'rain' || weatherCondition === 'storm') && need.category === 'SHELTER'

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
        borderRadius: '12px',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        height: '72px',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        animation: shouldPulseShelter ? 'pulse-border 1.6s ease-in-out infinite' : undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,158,0,0.35)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,158,0,0.18)'
      }}
    >
      {/* Left: badges */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', flexShrink: 0 }}>
        {/* Category badge */}
        <Badge variant={isSilver ? 'silver' : isViolet ? 'medium' : 'processed'}>
          {CATEGORY_LABELS[need.category] || need.category}
        </Badge>

        {/* Urgency badge */}
        <Badge variant={badgeVariant}>
          {URGENCY_LABELS[need.urgency] || need.urgency}
        </Badge>
      </div>

      {/* Center: ward name */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF' }}>
          {displayWard((need as any).ward_name || need.ward_id)}
        </span>
        <span style={{ 
          fontSize: '13px', 
          color: '#D9D9D9', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          display: 'block'
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
