import { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper'
import { useDispatch } from '../hooks/useDispatch'
import { Spinner } from '../components/ui/Spinner'
import { MatchScoreBar } from '../components/ui/MatchScoreBar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import type { Dispatch as DispatchModel } from '../types'
import { motion } from 'framer-motion'
import { useSocket } from '../hooks/useSocket'
import { useQueryClient } from '@tanstack/react-query'
import { C } from '../utils/colors'

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.65)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
  overflow: 'hidden',
}

export function Dispatch() {
  const { data: dispatches, isLoading } = useDispatch()
  const queryClient = useQueryClient()
  const [flashingId, setFlashingId] = useState<string | null>(null)

  useSocket('dispatch_status_changed', (payload) => {
    setFlashingId(payload.id)
    queryClient.invalidateQueries({ queryKey: ['dispatches'] })
    setTimeout(() => setFlashingId(null), 600)
  })

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Dispatch Tracking</h1>
          <p style={{ fontSize: '14px', color: C.textMuted, marginTop: '4px' }}>Monitor live volunteer dispatch status</p>
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
              gridTemplateColumns: '2fr 1.5fr 2fr 1fr 1fr',
              gap: '16px',
              padding: '14px 20px',
              background: 'rgba(255,158,0,0.08)',
              borderBottom: '1px solid rgba(255,158,0,0.12)',
            }}>
              {['Category & Ward', 'Volunteer', 'Match Score', 'Status', 'Actions'].map(h => (
                <span key={h} style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'rgba(217,217,217,0.55)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {dispatches?.map(d => (
                <DispatchRow key={d.id} dispatch={d} isFlashing={flashingId === d.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

function DispatchRow({ dispatch, isFlashing }: { dispatch: DispatchModel; isFlashing: boolean }) {
  const accentColor: Record<string, string> = {
    PENDING_ACCEPT: 'rgba(217,217,217,0.3)',
    ACCEPTED: C.violet,
    IN_PROGRESS: C.orange,
    COMPLETED: 'transparent',
    DECLINED: 'transparent',
  }

  const badgeVariantMap: Record<string, 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined'> = {
    PENDING_ACCEPT: 'pending',
    ACCEPTED: 'accepted',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    DECLINED: 'declined',
  }

  const isCompleted = dispatch.status === 'COMPLETED'
  const isDeclined = dispatch.status === 'DECLINED'

  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: isFlashing ? 'rgba(255,158,0,0.08)' : 'transparent' }}
      transition={{ duration: 0.6 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.5fr 2fr 1fr 1fr',
        gap: '16px',
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,158,0,0.08)',
        borderLeft: `3px solid ${accentColor[dispatch.status]}`,
        alignItems: 'center',
        opacity: isCompleted ? 0.5 : 1,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontWeight: 500, color: C.silver, fontSize: '14px' }}>Need Category</span>
        <span style={{ fontSize: '12px', color: C.textMuted }}>Ward</span>
      </div>
      <div style={{ fontSize: '14px', fontWeight: 500, color: C.silver }}>
        <span style={{ textDecoration: isDeclined ? 'line-through' : 'none' }}>Volunteer Name</span>
      </div>
      <MatchScoreBar score={dispatch.match_score} />
      <Badge variant={badgeVariantMap[dispatch.status]}>
        {dispatch.status.replace('_', ' ')}
      </Badge>
      <Button variant="secondary" style={{ fontSize: '12px', padding: '5px 12px' }}>View</Button>
    </motion.div>
  )
}
