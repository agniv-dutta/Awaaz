import { useMemo } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { LiveFeed } from '../components/realtime/LiveFeed'
import { NeedCard } from '../components/needs/NeedCard'
import { useNeeds } from '../hooks/useNeeds'
import { useAnalyticsSummary } from '../hooks/useAnalytics'
import { C } from '../utils/colors'

const MOCK_METRICS = {
  open_needs: 214,
  critical_today: 38,
  active_volunteers: 47,
  dispatch_rate: '89%',
}

// Glass card style shared across Dashboard
const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.65)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
}

export function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useAnalyticsSummary()
  const { data: needs, isLoading: loadingNeeds } = useNeeds()

  const urgentNeeds = useMemo(() => {
    if (!needs) return []
    return [...needs]
      .sort((a, b) => b.urgency_score - a.urgency_score)
      .slice(0, 5)
  }, [needs])

  // Stable seeded heat cells — 5×5 grid
  const mockHeatCells = useMemo(() => {
    return [0.82, 0.34, 0.61, 0.91, 0.45,
            0.27, 0.73, 0.55, 0.88, 0.12,
            0.66, 0.49, 0.78, 0.31, 0.95,
            0.40, 0.57, 0.83, 0.22, 0.69,
            0.14, 0.76, 0.53, 0.38, 0.92]
  }, [])

  const openNeeds = summary?.open_needs ?? MOCK_METRICS.open_needs
  const criticalToday = loadingNeeds
    ? MOCK_METRICS.critical_today
    : (urgentNeeds.filter(n => n.urgency === 'CRITICAL').length || MOCK_METRICS.critical_today)
  const activeVolunteers = summary?.active_volunteers ?? MOCK_METRICS.active_volunteers
  const dispatchRate = summary
    ? `${Math.round(((summary.completed_dispatches || 0) / (summary.total_needs || 1)) * 100)}%`
    : MOCK_METRICS.dispatch_rate

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Metric Cards — 4 in a row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          <MetricCard
            label="Open Needs"
            value={loadingSummary ? '—' : String(openNeeds)}
            trend="↑ 12 since yesterday"
          />
          <MetricCard
            label="Critical Today"
            value={String(criticalToday)}
            trend="↑ 5 since yesterday"
            trendColor={C.orange}
          />
          <MetricCard
            label="Active Volunteers"
            value={loadingSummary ? '—' : String(activeVolunteers)}
            trend="→ No change"
            trendColor={C.textMuted}
          />
          <MetricCard
            label="Dispatch Rate"
            value={loadingSummary ? '—' : dispatchRate}
            trend="↑ 3% this week"
          />
        </div>

        {/* Map placeholder + Live Feed */}
        <div style={{ display: 'grid', gridTemplateColumns: '58% 1fr', gap: '24px', alignItems: 'stretch' }}>

          {/* Map placeholder */}
          <div style={{ ...glassCard, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '340px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 48px)',
              gap: '8px',
              margin: 'auto',
            }}>
              {mockHeatCells.map((intensity, i) => {
                let bg: string
                let opacity: number
                if (intensity > 0.75) { bg = '#FF9E00'; opacity = 0.9 }
                else if (intensity > 0.5) { bg = '#E05A00'; opacity = 0.75 }
                else if (intensity > 0.25) { bg = '#9B3000'; opacity = 0.6 }
                else { bg = 'rgba(255,158,0,0.12)'; opacity = 1 }

                return (
                  <div key={i} style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    background: bg,
                    opacity,
                  }} />
                )
              })}
            </div>
            <p style={{
              fontSize: '12px',
              color: 'rgba(217, 217, 217, 0.45)',
              marginTop: '16px',
              textAlign: 'center',
            }}>
              Simulated need density — Mumbai wards
            </p>
          </div>

          {/* Live Feed */}
          <div style={{ ...glassCard, padding: '20px 20px 16px' }}>
            <LiveFeed />
          </div>
        </div>

        {/* Urgent Needs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 500, color: C.textPrimary, margin: 0 }}>
            Most urgent needs
          </h2>
          {loadingNeeds ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: C.textMuted, fontSize: '14px' }}>
              Loading…
            </div>
          ) : urgentNeeds.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: C.textMuted, fontSize: '14px' }}>
              No urgent needs at this time
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {urgentNeeds.map(need => (
                <NeedCard key={need.id} need={need} onDispatch={(id) => console.log('Dispatch', id)} />
              ))}
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  )
}

interface MetricCardProps {
  label: string
  value: string
  trend: string
  trendColor?: string
}

function MetricCard({ label, value, trend, trendColor = C.orange }: MetricCardProps) {
  return (
    <div style={{
      ...glassCard,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      minHeight: '110px',
    }}>
      <span style={{
        fontSize: '11px',
        color: 'rgba(217, 217, 217, 0.55)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 400,
      }}>
        {label}
      </span>
      <span style={{ fontSize: '36px', fontWeight: 500, color: '#FFFFFF', lineHeight: 1, marginTop: '6px' }}>
        {value}
      </span>
      <span style={{ fontSize: '12px', color: trendColor }}>
        {trend}
      </span>
    </div>
  )
}
