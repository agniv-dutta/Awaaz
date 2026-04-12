import { useMemo, useState, useEffect } from 'react'
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
  dispatch_rate_val: 89,
}

const MOCK_NEEDS_FALLBACK = [
  { id: '1', category: 'MEDICAL', urgency: 'CRITICAL' as const, ward_id: 'Dharavi', report_count: 38, description: 'Urgent medical attention needed for elderly residents', urgency_score: 95 },
  { id: '2', category: 'FOOD', urgency: 'HIGH' as const, ward_id: 'Kurla East', report_count: 27, description: 'Food shortage affecting 200+ families', urgency_score: 85 },
  { id: '3', category: 'SHELTER', urgency: 'HIGH' as const, ward_id: 'Govandi', report_count: 19, description: 'Temporary shelter required after flooding', urgency_score: 80 },
  { id: '4', category: 'EDUCATION', urgency: 'MEDIUM' as const, ward_id: 'Mankhurd', report_count: 14, description: 'School supplies and tutoring volunteers needed', urgency_score: 60 },
  { id: '5', category: 'MEDICAL', urgency: 'CRITICAL' as const, ward_id: 'Bandra West', report_count: 31, description: 'Mental health support camp requested', urgency_score: 92 },
]

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.65)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
}

export function Dashboard() {
  const { data: summary } = useAnalyticsSummary()
  const { data: needs } = useNeeds()

  // Use mock values as initial state to avoid "—" dashes
  const [metrics, setMetrics] = useState({
    openNeeds: MOCK_METRICS.open_needs,
    criticalToday: MOCK_METRICS.critical_today,
    activeVolunteers: MOCK_METRICS.active_volunteers,
    dispatchRate: `${MOCK_METRICS.dispatch_rate_val}%`
  })

  const urgentNeeds = useMemo(() => {
    const dataSource = needs && needs.length > 0 ? needs : MOCK_NEEDS_FALLBACK
    return [...dataSource]
      .sort((a, b) => (b.urgency_score || 0) - (a.urgency_score || 0))
      .slice(0, 5)
  }, [needs])

  useEffect(() => {
    if (summary) {
      setMetrics({
        openNeeds: summary.open_needs || MOCK_METRICS.open_needs,
        criticalToday: needs?.filter(n => n.urgency === 'CRITICAL').length || MOCK_METRICS.critical_today,
        activeVolunteers: summary.active_volunteers || MOCK_METRICS.active_volunteers,
        dispatchRate: summary.total_needs 
          ? `${Math.round(((summary.completed_dispatches || 0) / (summary.total_needs || 1)) * 100)}%`
          : `${MOCK_METRICS.dispatch_rate_val}%`
      })
    }
  }, [summary, needs])

  const mockHeatCells = useMemo(() => {
    return [0.82, 0.34, 0.61, 0.91, 0.45, 0.27, 0.73, 0.55, 0.88, 0.12, 0.66, 0.49, 0.78, 0.31, 0.95, 0.40, 0.57, 0.83, 0.22, 0.69, 0.14, 0.76, 0.53, 0.38, 0.92]
  }, [])

  return (
    <PageWrapper noPadding>
      {/* Community Pulse Marquee */}
      <div style={{
        height: '40px',
        background: 'rgba(255, 158, 0, 0.08)',
        borderBottom: '1px solid rgba(255, 158, 0, 0.12)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}>
        <div style={{
          whiteSpace: 'nowrap',
          display: 'inline-block',
          animation: 'marquee 30s linear infinite',
          paddingLeft: '100%',
          fontSize: '13px',
          color: 'rgba(217, 217, 217, 0.65)',
          letterSpacing: '0.02em',
        }}>
          38 critical needs open in Mumbai · 47 volunteers active today · Dharavi Ward: food shortage reported · Kurla: medical support needed · 89% dispatch success rate this week · New reports coming in from Bandra West · 
        </div>
      </div>

      <div style={{ padding: '24px 48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <MetricCard label="Open Needs" value={String(metrics.openNeeds)} trend="↑ 12 since yesterday" />
          <MetricCard label="Critical Today" value={String(metrics.criticalToday)} trend="↑ 5 since yesterday" trendColor={C.orange} />
          <MetricCard label="Active Volunteers" value={String(metrics.activeVolunteers)} trend="→ No change" trendColor="#D9D9D9" />
          <MetricCard label="Dispatch Rate" value={metrics.dispatchRate} trend="↑ 3% this week" />
        </div>

        {/* Middle Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '58% 1fr', gap: '24px', alignItems: 'stretch' }}>
          <div style={{ ...glassCard, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '340px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 48px)', gap: '8px', margin: 'auto' }}>
              {mockHeatCells.map((intensity, i) => (
                <div key={i} style={{
                  width: '48px', height: '48px', borderRadius: '8px',
                  background: intensity > 0.75 ? '#FF9E00' : intensity > 0.5 ? '#E05A00' : intensity > 0.25 ? '#9B3000' : 'rgba(255,158,0,0.12)',
                  opacity: intensity > 0.75 ? 0.9 : intensity > 0.5 ? 0.75 : intensity > 0.25 ? 0.6 : 1,
                }} />
              ))}
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(217, 217, 217, 0.35)', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simulated need density — Mumbai wards
            </p>
          </div>
          <div style={{ ...glassCard, padding: '20px 20px 16px' }}>
            <LiveFeed />
          </div>
        </div>

        {/* Urgent Needs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#FFFFFF' }}>Most urgent needs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {urgentNeeds.map(need => (
              <NeedCard key={need.id} need={need as any} onDispatch={(id) => console.log('Dispatch', id)} />
            ))}
          </div>
        </div>

        {/* About Section */}
        <div style={{ marginTop: '48px', borderTop: '1px solid rgba(255,158,0,0.12)', paddingTop: '48px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', margin: 0 }}>About Awaaz</h2>
            <p style={{ fontSize: '16px', color: '#D9D9D9', marginTop: '4px' }}>Built to give communities a voice</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <AboutCard 
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9E00" strokeWidth="2"><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/><circle cx="12" cy="16" r="3"/></svg>}
              title="Scattered voices"
              body="NGOs and field workers collect vital community data through paper surveys, WhatsApp messages, and verbal reports — but it lives in silos. No one sees the full picture."
            />
            <AboutCard 
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9E00" strokeWidth="2"><path d="M3 3h18l-3 9h-12l-3-9z"/><path d="M12 12v9"/></svg>}
              title="One clear signal"
              body="Awaaz aggregates community reports across wards, automatically surfaces the most urgent needs, and builds a live intelligence layer that gets smarter with every submission."
              accent
            />
            <AboutCard 
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C77DFF" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></svg>}
              title="Action, matched fast"
              body="Our smart dispatch engine scores and routes volunteers by skill, proximity, availability, and reliability — so the right person reaches the right place before it's too late."
            />
          </div>

          {/* Impact Banner */}
          <div style={{ ...glassCard, padding: '28px 40px', marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '64px' }}>
            <ImpactStat value="5" label="Mumbai wards covered" />
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' }} />
            <ImpactStat value="214" label="open needs tracked" />
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' }} />
            <ImpactStat value="47" label="volunteers on platform" />
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' }} />
            <ImpactStat value="89%" label="dispatch success rate" />
          </div>

          {/* Footer */}
          <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', paddingBottom: '32px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(217, 217, 217, 0.4)' }}>Awaaz · Community Intelligence Platform</span>
            <span style={{ fontSize: '13px', color: 'rgba(217, 217, 217, 0.4)' }}>Made with purpose for Mumbai communities</span>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

function MetricCard({ label, value, trend, trendColor = C.orange }: { label: string; value: string; trend: string; trendColor?: string }) {
  return (
    <div className="glass-card" style={{ ...glassCard, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '110px' }}>
      <span style={{ fontSize: '11px', color: 'rgba(217, 217, 217, 0.55)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: '36px', fontWeight: 500, color: '#FFFFFF', lineHeight: 1, marginTop: '6px' }}>{value}</span>
      <span style={{ fontSize: '12px', color: trendColor }}>{trend || '—'}</span>
    </div>
  )
}

function AboutCard({ icon, title, body, accent }: { icon: any; title: string; body: string; accent?: boolean }) {
  return (
    <div style={{ ...glassCard, padding: '28px', border: accent ? '1px solid rgba(255,158,0,0.4)' : glassCard.border }}>
      <div style={{ marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '17px', fontWeight: 500, color: '#FFFFFF', border: 'none', padding: 0, marginBottom: '12px' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: '#D9D9D9', lineHeight: 1.7, margin: 0 }}>{body}</p>
    </div>
  )
}

function ImpactStat({ value, label }: { value: string, label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '36px', fontWeight: 500, color: '#FFFFFF' }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'rgba(217, 217, 217, 0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{label}</div>
    </div>
  )
}
