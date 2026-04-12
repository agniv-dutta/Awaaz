import type { Volunteer } from '../../types'
import { Avatar } from '../ui/Avatar'
import { ReliabilityArc } from './ReliabilityArc'
import { C } from '../../utils/colors'

interface VolunteerCardProps {
  volunteer: Volunteer
  onClick?: () => void
}

export function VolunteerCard({ volunteer, onClick }: VolunteerCardProps) {
  const name = (volunteer as any).name || 'Volunteer'

  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(26,26,26,0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,158,0,0.18)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,158,0,0.40)'
        ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(26,26,26,0.75)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,158,0,0.18)'
        ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(26,26,26,0.65)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar initials={name} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '15px', fontWeight: 500, color: C.silver }}>{name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: volunteer.is_active ? C.orange : 'rgba(255,158,0,0.2)',
              }} />
              <span style={{ fontSize: '12px', color: C.textMuted }}>
                {volunteer.is_active ? 'Available today' : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>
        <ReliabilityArc score={volunteer.reliability_score} />
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {volunteer.skills.map(skill => (
          <span key={skill} style={{
            padding: '2px 10px',
            borderRadius: '20px',
            background: 'rgba(255,158,0,0.08)',
            border: '1px solid rgba(255,158,0,0.18)',
            fontSize: '11px',
            color: 'rgba(217,217,217,0.7)',
            fontWeight: 500,
          }}>
            {skill}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: C.textMuted, paddingTop: '4px', borderTop: '1px solid rgba(255,158,0,0.08)' }}>
        <span>Ward {volunteer.home_ward_id}</span>
        <span>{volunteer.completed_tasks} tasks done</span>
      </div>
    </div>
  )
}
