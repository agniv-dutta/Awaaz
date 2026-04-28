import { useEffect, useState } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useDispatch } from '../hooks/useDispatch'
import { MatchScoreBar } from '../components/ui/MatchScoreBar'
import { Badge } from '../components/ui/Badge'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '../hooks/useSocket'
import { useQueryClient } from '@tanstack/react-query'
import { generateDispatchSuggestion } from '../services/ai'
import { CATEGORY_LABELS, STATUS_LABELS } from '../utils/labels'
import { EmptyState } from '../components/ui/EmptyState'
import { useIsMobile } from '../hooks/useIsMobile'

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.65)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
  overflow: 'hidden',
}

type DispatchRowModel = {
  id: number
  category: 'MEDICAL' | 'FOOD' | 'SHELTER' | 'EDUCATION' | 'LOGISTICS'
  ward: string
  volunteer: string
  volunteerInitials: string
  matchScore: number
  status: 'IN_PROGRESS' | 'ACCEPTED' | 'PENDING_ACCEPT' | 'COMPLETED' | 'DECLINED'
  dispatchedAt: string
  need: string
  matchBreakdown: {
    skillMatch: number
    proximityScore: number
    reliabilityScore: number
    availabilityScore: number
    languageMatch: number
  }
}

const MOCK_DISPATCHES: DispatchRowModel[] = [
  {
    id: 1,
    category: 'MEDICAL',
    ward: 'Dharavi Ward',
    volunteer: 'Rahul Kulkarni',
    volunteerInitials: 'RK',
    matchScore: 0.91,
    status: 'IN_PROGRESS',
    dispatchedAt: '2h ago',
    need: 'Elderly care - urgent medical attention',
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
    need: 'Ration kit delivery - senior citizens',
    matchBreakdown: { skillMatch: 0.6, proximityScore: 0.85, reliabilityScore: 0.89, availabilityScore: 0.65, languageMatch: 0.75 },
  },
]

const MOCK_NEEDS = [
  {
    id: 'n1',
    category: 'MEDICAL',
    urgency: 'CRITICAL',
    description: 'Elderly care support with immediate medical intervention required.',
    ward: 'Dharavi Ward',
    reportCount: 38,
  },
  {
    id: 'n2',
    category: 'FOOD',
    urgency: 'HIGH',
    description: 'Ration kit delivery for flood-affected families.',
    ward: 'Kurla East Ward',
    reportCount: 24,
  },
]

const MOCK_VOLUNTEERS = [
  { name: 'Rahul Kulkarni', skills: ['MEDICAL', 'LOGISTICS'], reliability: 0.92, distance: '1.2 km' },
  { name: 'Meera Iyer', skills: ['MEDICAL', 'LEGAL'], reliability: 0.95, distance: '2.1 km' },
  { name: 'Priya Desai', skills: ['FOOD', 'COOKING'], reliability: 0.84, distance: '0.8 km' },
]

function CategoryBadge({ category }: { category: string }) {
  const getCategoryVariant = (cat: string): 'orange' | 'violet' | 'silver' => {
    if (cat === 'FOOD' || cat === 'MEDICAL') return 'orange';
    if (cat === 'MENTAL_HEALTH' || cat === 'LEGAL') return 'violet';
    return 'silver';
  };
  return (
    <Badge variant={getCategoryVariant(category)} style={{ fontSize: '10px' }}>
      {CATEGORY_LABELS[category] || category}
    </Badge>
  )
}

export function Dispatch() {
  const { data: dispatches, isLoading } = useDispatch()
  const isMobile = useIsMobile(980)
  const queryClient = useQueryClient()
  const [flashingId, setFlashingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [xaiRow, setXaiRow] = useState<number | null>(null)
  const [suggestion, setSuggestion] = useState<string>('')
  const [suggestionLoading, setSuggestionLoading] = useState(false)

  useSocket('dispatch_status_changed', (payload) => {
    setFlashingId(payload.id)
    queryClient.invalidateQueries({ queryKey: ['dispatches'] })
    setTimeout(() => setFlashingId(null), 600)
  })

  const tableData = dispatches && dispatches.length > 0 ? (dispatches as any) : MOCK_DISPATCHES;

  const refreshSuggestion = async () => {
    setSuggestionLoading(true)
    try {
      const urgencyOrder: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
      const need = [...MOCK_NEEDS].sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency])[0]
      const text = await generateDispatchSuggestion(need, MOCK_VOLUNTEERS)
      setSuggestion(text || 'No recommendation available right now.')
    } catch {
      setSuggestion('No recommendation available right now.')
    } finally {
      setSuggestionLoading(false)
    }
  }

  useEffect(() => {
    refreshSuggestion()
  }, [])

  const activeCount = tableData.filter((d: any) => d.status === 'IN_PROGRESS' || d.status === 'ACCEPTED').length
  const pendingCount = tableData.filter((d: any) => d.status === 'PENDING_ACCEPT').length
  const completedCount = tableData.filter((d: any) => d.status === 'COMPLETED').length
  const tableColumns = isMobile ? '2.2fr 1.4fr 1.2fr 1.2fr 0.9fr' : '2fr 1.5fr 1.5fr 1fr 1fr'
  const tableMinWidth = isMobile ? '760px' : '100%'

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '8px' : 0 }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Dispatch Tracking</h1>
            <p style={{ fontSize: '15px', color: '#D9D9D9', marginTop: '4px' }}>Monitor live volunteer dispatch status</p>
          </div>
          {isLoading && (
            <div style={{ fontSize: '12px', color: 'rgba(217,217,217,0.5)', paddingTop: '6px' }}>
              syncing...
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Active', value: activeCount, borderColor: '#FF9E00' },
            { label: 'Pending response', value: pendingCount, borderColor: 'rgba(217, 217, 217, 0.4)' },
            { label: 'Completed', value: completedCount, borderColor: '#C77DFF' },
          ].map((stat, idx) => (
            <div key={idx} style={{ ...glassCard, padding: '20px', borderLeft: `3px solid ${stat.borderColor}` }}>
              <div style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#D9D9D9', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...glassCard, borderLeft: '3px solid #C77DFF', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2 L10.5 7.5 L16 9 L10.5 10.5 L9 16 L7.5 10.5 L2 9 L7.5 7.5 Z" fill="#C77DFF"/>
              </svg>
              <span style={{ fontSize: '13px', color: '#C77DFF', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
                AI Dispatch Advisor
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(199,125,255,0.5)', border: '1px solid rgba(199,125,255,0.25)', borderRadius: '999px', padding: '2px 8px' }}>
                Powered by Google Gemini
              </span>
            </div>
            <button
              onClick={refreshSuggestion}
              style={{
                background: 'transparent',
                border: '1px solid rgba(199,125,255,0.35)',
                borderRadius: '8px',
                color: '#C77DFF',
                fontSize: '12px',
                padding: '6px 10px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Refresh suggestion
            </button>
          </div>

          {suggestionLoading ? (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', minHeight: '38px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C77DFF', animation: 'pulse-dot 1s ease infinite' }} />
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C77DFF', animation: 'pulse-dot 1s ease 0.15s infinite' }} />
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#C77DFF', animation: 'pulse-dot 1s ease 0.3s infinite' }} />
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: '#D9D9D9', lineHeight: 1.6, margin: 0 }}>
              {suggestion || 'No recommendation available right now.'}
            </p>
          )}

          <div style={{ fontSize: '11px', color: 'rgba(217,217,217,0.35)', marginTop: '10px' }}>
            Based on current needs + volunteer availability
          </div>
        </div>

        <div style={{ ...glassCard, overflowX: 'auto' }}>
          <div style={{ minWidth: tableMinWidth }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: tableColumns,
              gap: '16px',
              padding: '14px 20px',
              background: 'rgba(255,158,0,0.08)',
              borderBottom: '1px solid rgba(255,158,0,0.12)',
            }}>
              {['Category & Ward', 'Volunteer', 'Match Score', 'Status', 'Time'].map((h) => (
                <span key={h} style={{ fontSize: '11px', fontWeight: 600, color: '#D9D9D9', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {tableData.length === 0 ? (
                <EmptyState emptyMessage="No dispatches yet. Assign a volunteer to an urgent need to get started." />
              ) : (
                tableData.map((d: any) => (
                  <DispatchRow
                    key={d.id}
                    dispatch={d}
                    isFlashing={flashingId === String(d.id)}
                    isExpanded={expandedId === d.id}
                    onToggleExpand={() => { setExpandedId(expandedId === d.id ? null : d.id); setXaiRow(null); }}
                    xaiExpanded={xaiRow === d.id}
                    onToggleXai={() => { setXaiRow(xaiRow === d.id ? null : d.id); setExpandedId(null); }}
                    tableColumns={tableColumns}
                    isMobile={isMobile}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

function DispatchRow({ dispatch, isFlashing, isExpanded, onToggleExpand, xaiExpanded, onToggleXai, tableColumns, isMobile }: { dispatch: DispatchRowModel; isFlashing: boolean; isExpanded: boolean; onToggleExpand: () => void; xaiExpanded: boolean; onToggleXai: () => void; tableColumns: string; isMobile: boolean }) {
  const accentColor: Record<string, string> = {
    PENDING_ACCEPT: 'rgba(217,217,217,0.3)',
    ACCEPTED: '#C77DFF',
    IN_PROGRESS: '#FF9E00',
    COMPLETED: 'rgba(217,217,217,0.15)',
    DECLINED: 'rgba(220,50,50,0.5)',
  }

  const badgeVariantMap: Record<string, 'orange' | 'violet' | 'green' | 'red' | 'silver'> = {
    PENDING_ACCEPT: 'silver',
    ACCEPTED: 'violet',
    IN_PROGRESS: 'orange',
    COMPLETED: 'green',
    DECLINED: 'red',
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
          gridTemplateColumns: tableColumns,
          gap: '16px',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,158,0,0.08)',
          borderLeft: `3px solid ${accentColor[dispatch.status]}`,
          alignItems: 'center',
          opacity: isCompleted ? 0.55 : 1,
          cursor: 'pointer',
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isFlashing ? 'rgba(255,158,0,0.08)' : 'transparent'
        }}
      >
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
            <CategoryBadge category={dispatch.category} />
          </div>
          <div style={{ fontSize: '13px', color: '#D9D9D9' }}>{dispatch.ward}</div>
          <div style={{ fontSize: '11px', color: 'rgba(217, 217, 217, 0.4)', marginTop: '2px' }}>{dispatch.need}</div>
        </div>

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
          <span style={{ fontSize: '14px', color: '#D9D9D9', textDecoration: isDeclined ? 'line-through' : 'none' }}>
            {dispatch.volunteer}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MatchScoreBar score={dispatch.matchScore} breakdown={dispatch.matchBreakdown} />
            <span style={{ fontSize: '12px', color: '#D9D9D9' }}>{Math.round(dispatch.matchScore * 100)}%</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleXai() }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(199,125,255,0.7)',
              fontSize: '11px',
              cursor: 'pointer',
              textAlign: 'left',
              padding: 0,
              letterSpacing: '0.03em',
            }}
          >
            ✦ Why this match?
          </button>
        </div>

        <div>
          <Badge variant={badgeVariantMap[dispatch.status]}>
            {STATUS_LABELS[dispatch.status] || dispatch.status}
          </Badge>
        </div>

        <div style={{ fontSize: '12px', color: 'rgba(217, 217, 217, 0.5)', textAlign: 'right' }}>
          {dispatch.dispatchedAt}
        </div>
      </motion.div>

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
              flexWrap: isMobile ? 'wrap' : 'nowrap',
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
                }} />
                <span style={{ fontSize: '12px', color: 'rgba(217, 217, 217, 0.6)' }}>{item.step}</span>
                {idx < 4 && <div style={{ width: '20px', height: '1px', background: 'rgba(255, 158, 0, 0.15)' }} />}
              </div>
            ))}
          </motion.div>
        )}
        {xaiExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'rgba(199,125,255,0.04)',
              borderTop: '1px solid rgba(199,125,255,0.12)',
              borderBottom: '1px solid rgba(199,125,255,0.12)',
              padding: '16px 20px 16px 60px',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: '16px', right: '20px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleXai() }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'rgba(217,217,217,0.4)', fontSize: '12px',
                }}
              >
                ✕ Close
              </button>
            </div>
            <div style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 500, marginBottom: '12px' }}>
              Match score explained — {(dispatch.matchScore * 100).toFixed(0)}% overall compatibility
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { name: 'Skill Match', value: dispatch.matchBreakdown.skillMatch, color: '#FF9E00', weight: '×0.35' },
                { name: 'Proximity', value: dispatch.matchBreakdown.proximityScore, color: '#C77DFF', weight: '×0.25' },
                { name: 'Reliability', value: dispatch.matchBreakdown.reliabilityScore, color: '#4ade80', weight: '×0.20' },
                { name: 'Availability', value: dispatch.matchBreakdown.availabilityScore, color: '#FF9E00', weight: '×0.15' },
                { name: 'Language', value: dispatch.matchBreakdown.languageMatch, color: '#C77DFF', weight: '×0.05' },
              ].map((factor, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(217,217,217,0.6)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{factor.name}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(217,217,217,0.3)' }}>({factor.weight} weight)</div>
                  </div>
                  <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.06)', marginTop: '8px', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${factor.value * 100}%`, height: '100%', background: factor.color }} />
                  </div>
                  <div style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 500, marginTop: '4px' }}>
                    {factor.value.toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div style={{ gridColumn: 'span 2', fontSize: '11px', color: 'rgba(217,217,217,0.35)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '8px' }}>
                Awaaz AI weighs skill compatibility most heavily (35%), followed by geographic proximity (25%) and volunteer reliability history (20%).
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
