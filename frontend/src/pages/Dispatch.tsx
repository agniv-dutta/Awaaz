import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper'
import { useDispatch } from '../hooks/useDispatch'
import { Spinner } from '../components/ui/Spinner'
import { MatchScoreBar } from '../components/ui/MatchScoreBar'
import { Badge } from '../components/ui/Badge'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '../hooks/useSocket'
import { useQueryClient } from '@tanstack/react-query'

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.65)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
  overflow: 'hidden',
}

interface MockDispatch {
  id: number;
  category: 'MEDICAL' | 'FOOD' | 'SHELTER' | 'EDUCATION' | 'LOGISTICS';
  ward: string;
  volunteer: string;
  volunteerInitials: string;
  matchScore: number;
  status: 'IN_PROGRESS' | 'ACCEPTED' | 'PENDING_ACCEPT' | 'COMPLETED' | 'DECLINED';
  dispatchedAt: string;
  need: string;
  matchBreakdown: {
    skillMatch: number;
    proximityScore: number;
    reliabilityScore: number;
    availabilityScore: number;
    languageMatch: number;
  };
}

const MOCK_DISPATCHES: MockDispatch[] = [
  {
    id: 1,
    category: 'MEDICAL',
    ward: 'Dharavi Ward',
    volunteer: 'Rahul Kulkarni',
    volunteerInitials: 'RK',
    matchScore: 0.91,
    status: 'IN_PROGRESS',
    dispatchedAt: '2h ago',
    need: 'Elderly care — urgent medical attention',
    matchBreakdown: { skillMatch: 1.0, proximityScore: 0.85, reliabilityScore: 0.92, availabilityScore: 1.0, languageMatch: 0.8 },
  },
  {
    id: 2,
    category: 'FOOD',
    ward: 'Kurla East Ward',
    volunteer: 'Priya Desai',
    volunteerInitials: 'PD',
    matchScore: 0.84,
    status: 'ACCEPTED',
    dispatchedAt: '3h ago',
    need: 'Food distribution for 200+ families',
    matchBreakdown: { skillMatch: 0.8, proximityScore: 0.9, reliabilityScore: 0.88, availabilityScore: 0.75, languageMatch: 0.85 },
  },
  {
    id: 3,
    category: 'SHELTER',
    ward: 'Govandi Ward',
    volunteer: 'Devraj Patil',
    volunteerInitials: 'DP',
    matchScore: 0.76,
    status: 'PENDING_ACCEPT',
    dispatchedAt: '45min ago',
    need: 'Temporary shelter after flooding',
    matchBreakdown: { skillMatch: 0.7, proximityScore: 0.85, reliabilityScore: 0.76, availabilityScore: 0.7, languageMatch: 0.9 },
  },
  {
    id: 4,
    category: 'EDUCATION',
    ward: 'Mankhurd Ward',
    volunteer: 'Ananya Sharma',
    volunteerInitials: 'AS',
    matchScore: 0.88,
    status: 'COMPLETED',
    dispatchedAt: '1d ago',
    need: 'School supplies distribution',
    matchBreakdown: { skillMatch: 1.0, proximityScore: 0.8, reliabilityScore: 0.92, availabilityScore: 0.85, languageMatch: 0.75 },
  },
  {
    id: 5,
    category: 'MEDICAL',
    ward: 'Bandra West Ward',
    volunteer: 'Meera Iyer',
    volunteerInitials: 'MI',
    matchScore: 0.95,
    status: 'IN_PROGRESS',
    dispatchedAt: '1h ago',
    need: 'Mental health support camp',
    matchBreakdown: { skillMatch: 1.0, proximityScore: 0.9, reliabilityScore: 0.95, availabilityScore: 1.0, languageMatch: 0.9 },
  },
  {
    id: 6,
    category: 'FOOD',
    ward: 'Borivali Ward',
    volunteer: 'Siddharth Nair',
    volunteerInitials: 'SN',
    matchScore: 0.72,
    status: 'DECLINED',
    dispatchedAt: '5h ago',
    need: 'Ration kit delivery — senior citizens',
    matchBreakdown: { skillMatch: 0.6, proximityScore: 0.85, reliabilityScore: 0.89, availabilityScore: 0.65, languageMatch: 0.75 },
  },
]

function CategoryBadge({ category }: { category: string }) {
  const variants: Record<string, 'critical' | 'high' | 'medium' | 'low' | 'silver'> = {
    MEDICAL: 'critical',
    FOOD: 'high',
    SHELTER: 'silver',
    EDUCATION: 'silver',
    LOGISTICS: 'medium',
  }
  return (
    <Badge variant={variants[category] || 'low'} style={{ fontSize: '10px' }}>
      {category}
    </Badge>
  )
}

export function Dispatch() {
  const { data: dispatches, isLoading } = useDispatch()
  const queryClient = useQueryClient()
  const [flashingId, setFlashingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useSocket('dispatch_status_changed', (payload) => {
    setFlashingId(payload.id)
    queryClient.invalidateQueries({ queryKey: ['dispatches'] })
    setTimeout(() => setFlashingId(null), 600)
  })

  // Use mock data or API data
  const data = (dispatches && dispatches.length > 0)
    ? dispatches
    : (MOCK_DISPATCHES as any)

  const activeCount = (Array.isArray(data) ? data : []).filter((d: any) => d.status === 'IN_PROGRESS' || d.status === 'ACCEPTED').length
  const pendingCount = (Array.isArray(data) ? data : []).filter((d: any) => d.status === 'PENDING_ACCEPT').length
  const completedCount = (Array.isArray(data) ? data : []).filter((d: any) => d.status === 'COMPLETED').length

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Dispatch Tracking</h1>
          <p style={{ fontSize: '15px', color: '#D9D9D9', marginTop: '4px' }}>Monitor live volunteer dispatch status</p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Active', value: activeCount, borderColor: '#FF9E00' },
            { label: 'Pending response', value: pendingCount, borderColor: 'rgba(217, 217, 217, 0.4)' },
            { label: 'Completed', value: completedCount, borderColor: '#C77DFF' },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                ...glassCard,
                padding: '20px',
                borderLeft: `3px solid ${stat.borderColor}`,
              }}
            >
              <div style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#D9D9D9', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
            <Spinner />
          </div>
        ) : (
          <div style={glassCard}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr',
              gap: '16px',
              padding: '14px 20px',
              background: 'rgba(255,158,0,0.08)',
              borderBottom: '1px solid rgba(255,158,0,0.12)',
            }}>
              {['Category & Ward', 'Volunteer', 'Match Score', 'Status', 'Time'].map(h => (
                <span key={h} style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#D9D9D9',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Array.isArray(data) && data.map((d: any) => (
                <DispatchRow
                  key={d.id}
                  dispatch={d}
                  isFlashing={flashingId === d.id}
                  isExpanded={expandedId === d.id}
                  onToggleExpand={() => setExpandedId(expandedId === d.id ? null : d.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

function DispatchRow({ dispatch, isFlashing, isExpanded, onToggleExpand }: { dispatch: any; isFlashing: boolean; isExpanded: boolean; onToggleExpand: () => void }) {
  const accentColor: Record<string, string> = {
    PENDING_ACCEPT: 'rgba(217,217,217,0.3)',
    ACCEPTED: '#C77DFF',
    IN_PROGRESS: '#FF9E00',
    COMPLETED: 'rgba(217,217,217,0.15)',
    DECLINED: 'rgba(220,50,50,0.5)',
  }

  const isCompleted = dispatch.status === 'COMPLETED'
  const isDeclined = dispatch.status === 'DECLINED'

  return (
    <>
      <motion.div
        initial={false}
        animate={{ backgroundColor: isFlashing ? 'rgba(255,158,0,0.08)' : 'transparent' }}
        transition={{ duration: 0.6 }}
        onClick={onToggleExpand}
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr',
          gap: '16px',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,158,0,0.08)',
          borderLeft: `3px solid ${accentColor[dispatch.status]}`,
          alignItems: 'center',
          opacity: isCompleted ? 0.55 : 1,
          cursor: isExpanded ? 'pointer' : 'pointer',
          transition: 'background-color 0.15s',
        }}
      >
        {/* Category + Ward */}
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
            <CategoryBadge category={dispatch.category} />
          </div>
          <div style={{ fontSize: '13px', color: '#D9D9D9' }}>{dispatch.ward}</div>
          <div style={{ fontSize: '11px', color: 'rgba(217, 217, 217, 0.4)', marginTop: '2px' }}>{dispatch.need}</div>
        </div>

        {/* Volunteer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(199, 125, 255, 0.15)',
            border: '1px solid rgba(199, 125, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            color: '#C77DFF',
            fontWeight: 500,
          }}>
            {dispatch.volunteerInitials}
          </div>
          <span style={{
            fontSize: '14px',
            color: '#D9D9D9',
            textDecoration: isDeclined ? 'line-through' : 'none',
          }}>
            {dispatch.volunteer}
          </span>
        </div>

        {/* Match Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MatchScoreBar score={dispatch.matchScore} breakdown={dispatch.matchBreakdown} />
          <span style={{ fontSize: '12px', color: '#D9D9D9' }}>{Math.round(dispatch.matchScore * 100)}%</span>
        </div>

        {/* Status Badge */}
        <div>
          <Badge variant={dispatch.status.toLowerCase().replace('_', '') as any}>
            {dispatch.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* Time */}
        <div style={{ fontSize: '12px', color: 'rgba(217, 217, 217, 0.45)', textAlign: 'right' }}>
          {dispatch.dispatchedAt}
        </div>
      </motion.div>

      {/* Expanded timeline */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderTop: '1px solid rgba(255, 158, 0, 0.08)',
              padding: '16px 20px 16px 40px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            {[
              { step: 'Dispatched', completed: true },
              { step: 'Notified', completed: dispatch.status !== 'PENDING_ACCEPT' },
              { step: 'Accepted', completed: dispatch.status !== 'PENDING_ACCEPT' && dispatch.status !== 'DECLINED' },
              { step: 'In Progress', completed: dispatch.status === 'IN_PROGRESS' || dispatch.status === 'COMPLETED' },
              { step: 'Completed', completed: dispatch.status === 'COMPLETED' },
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: item.completed ? '#FF9E00' : 'transparent',
                  border: `1px solid ${item.completed ? '#FF9E00' : 'rgba(255, 158, 0, 0.15)'}`,
                }}/>
                <span style={{ fontSize: '12px', color: 'rgba(217, 217, 217, 0.6)' }}>{item.step}</span>
                {idx < 4 && <div style={{ width: '20px', height: '1px', background: 'rgba(255, 158, 0, 0.15)' }} />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
