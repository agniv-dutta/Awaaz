import type { Volunteer } from '../../types'
import { Avatar } from '../ui/Avatar'
import { ReliabilityArc } from './ReliabilityArc'

interface VolunteerCardProps {
  volunteer: Volunteer
  onClick?: () => void
}

export function VolunteerCard({ volunteer, onClick }: VolunteerCardProps) {
  const name = (volunteer as any).name || 'Volunteer'

  return (
    <div
      onClick={onClick}
      className="glass-card"
      style={{
        background: 'rgba(26,26,26,0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,158,0,0.18)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Avatar 
            initials={name} 
            style={{ 
              width: '48px', height: '48px', 
              background: 'rgba(199, 125, 255, 0.15)', 
              border: '1px solid rgba(199, 125, 255, 0.3)', 
              color: '#C77DFF', 
              fontSize: '16px' 
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#FFFFFF' }}>{name}</span>
            <span style={{ fontSize: '13px', color: '#D9D9D9' }}>Ward {volunteer.home_ward_id}</span>
          </div>
        </div>
        <ReliabilityArc score={volunteer.reliability_score} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: volunteer.is_active ? '#4ade80' : 'rgba(217, 217, 217, 0.25)',
        }} />
        <span style={{ fontSize: '12px', color: '#D9D9D9' }}>
          {volunteer.is_active ? 'Available today' : 'Unavailable'}
        </span>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {volunteer.skills.map(skill => (
          <span key={skill} style={{
            padding: '2px 10px',
            borderRadius: '6px',
            background: 'rgba(255, 158, 0, 0.1)',
            border: '1px solid rgba(255, 158, 0, 0.15)',
            fontSize: '11px',
            color: 'rgba(217, 217, 217, 0.8)',
            fontWeight: 500,
          }}>
            {skill}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(217, 217, 217, 0.45)', fontStyle: 'italic' }}>
          {volunteer.id === '1' ? '1.2km away' : volunteer.id === '4' ? '0.8km away' : 'Nearby'}
        </span>
      </div>
    </div>
  )
}
