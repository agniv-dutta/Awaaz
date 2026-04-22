import { PageWrapper } from '../components/layout/PageWrapper'
import { useAnalyticsSummary } from '../hooks/useAnalytics'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { CATEGORY_LABELS } from '../utils/labels'

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.72)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
}

const CHART_LINES = [
  { key: 'medical', label: 'Medical', color: '#FF9E00' },
  { key: 'food', label: 'Food', color: '#C77DFF' },
  { key: 'shelter', label: 'Shelter', color: '#6EE7B7' },
]

const MOCK_TREND = [
  { name: 'Mon', medical: 42, food: 31, shelter: 18 },
  { name: 'Tue', medical: 48, food: 34, shelter: 24 },
  { name: 'Wed', medical: 39, food: 36, shelter: 29 },
  { name: 'Thu', medical: 53, food: 29, shelter: 33 },
  { name: 'Fri', medical: 61, food: 41, shelter: 30 },
  { name: 'Sat', medical: 57, food: 38, shelter: 27 },
  { name: 'Sun', medical: 50, food: 35, shelter: 25 },
]

const MOCK_WARDS = [
  { ward: 'Dharavi Ward', category: 'MEDICAL', reports: 68, response: '14m' },
  { ward: 'Kurla East Ward', category: 'FOOD', reports: 55, response: '18m' },
  { ward: 'Govandi Ward', category: 'SHELTER', reports: 44, response: '21m' },
  { ward: 'Mankhurd Ward', category: 'MEDICAL', reports: 39, response: '16m' },
]

function TrendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div style={{
      background: 'rgba(18,18,18,0.95)',
      border: '1px solid rgba(217,217,217,0.2)',
      borderRadius: '10px',
      padding: '10px',
      minWidth: '170px',
    }}>
      <div style={{ fontSize: '11px', color: '#D9D9D9', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '12px', color: '#D9D9D9', marginBottom: '3px' }}>
          <span>{entry.name}</span>
          <span style={{ color: entry.color }}>{entry.value} reports</span>
        </div>
      ))}
    </div>
  )
}

export function Analytics() {
  const { data } = useAnalyticsSummary()

  const stats = {
    open: data?.open_needs ?? 214,
    volunteers: data?.active_volunteers ?? 38,
    today: data?.today_dispatches ?? 47,
    rate: data?.open_needs ? Math.round(((data.today_dispatches ?? 47) / data.open_needs) * 100) : 89,
  }

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#FFFFFF', fontWeight: 500 }}>Analytics</h1>
          <p style={{ fontSize: '14px', color: '#D9D9D9', marginTop: '4px' }}>Operational trends and ward-level prioritization insights.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {[
            { label: 'Open needs', value: stats.open, border: '#FF9E00' },
            { label: 'Active volunteers', value: stats.volunteers, border: '#C77DFF' },
            { label: 'Today dispatches', value: stats.today, border: '#6EE7B7' },
            { label: 'Dispatch rate', value: `${stats.rate}%`, border: '#D9D9D9' },
          ].map((card) => (
            <div key={card.label} style={{ ...glassCard, padding: '16px', borderLeft: `3px solid ${card.border}` }}>
              <div style={{ fontSize: '26px', color: '#FFFFFF', fontWeight: 500 }}>{card.value}</div>
              <div style={{ fontSize: '11px', color: '#D9D9D9', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '8px' }}>{card.label}</div>
            </div>
          ))}
        </div>

        <div style={{ ...glassCard, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 500 }}>7-Day Need Trend</h3>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {CHART_LINES.map((line) => (
                <div key={line.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: line.color }} />
                  <span style={{ fontSize: '12px', color: '#D9D9D9' }}>{line.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_TREND} margin={{ top: 10, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid stroke="rgba(217,217,217,0.08)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#D9D9D9', fontSize: 12 }} axisLine={{ stroke: 'rgba(217,217,217,0.18)' }} tickLine={{ stroke: 'rgba(217,217,217,0.18)' }} />
                <YAxis tick={{ fill: '#D9D9D9', fontSize: 12 }} axisLine={{ stroke: 'rgba(217,217,217,0.18)' }} tickLine={{ stroke: 'rgba(217,217,217,0.18)' }} />
                <Tooltip content={<TrendTooltip />} />
                {CHART_LINES.map((line) => (
                  <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2.2} dot={{ r: 2.5 }} name={line.label} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={glassCard}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '14px', padding: '12px 16px', borderBottom: '1px solid rgba(255,158,0,0.12)', background: 'rgba(255,158,0,0.07)' }}>
            {['Ward', 'Priority Category', 'Reports', 'Avg. Response'].map((h) => (
              <span key={h} style={{ fontSize: '11px', color: '#D9D9D9', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{h}</span>
            ))}
          </div>

          {MOCK_WARDS.map((w) => (
            <div key={w.ward} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '14px', padding: '12px 16px', borderBottom: '1px solid rgba(255,158,0,0.08)' }}>
              <span style={{ fontSize: '13px', color: '#FFFFFF' }}>{w.ward}</span>
              <span style={{ fontSize: '12px', color: '#D9D9D9' }}>{CATEGORY_LABELS[w.category] || w.category}</span>
              <span style={{ fontSize: '12px', color: '#D9D9D9' }}>{w.reports}</span>
              <span style={{ fontSize: '12px', color: '#D9D9D9' }}>{w.response}</span>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
