import { PageWrapper } from '../components/layout/PageWrapper'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { CATEGORY_LABELS } from '../utils/labels'

const glassCard: React.CSSProperties = {
  background: 'rgba(10, 7, 4, 0.78)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 158, 0, 0.14)',
  borderRadius: '16px',
}

const ANALYTICS_METRICS = {
  openNeeds: 214,
  activeVolunteers: 47,
  todayDispatches: 38,
  dispatchRate: 89,
} as const

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

const PIE_DATA = [
  { name: 'Medical', value: 38, color: '#FF9E00' },
  { name: 'Food', value: 27, color: '#C77DFF' },
  { name: 'Shelter', value: 19, color: '#6EE7B7' },
  { name: 'Education', value: 12, color: '#D9D9D9' },
  { name: 'Legal', value: 4, color: 'rgba(217,217,217,0.6)' },
]

const BAR_DATA = [
  { ward: 'Dharavi', critical: 12, high: 18, medium: 8, low: 0 },
  { ward: 'Kurla', critical: 8, high: 15, medium: 4, low: 0 },
  { ward: 'Govandi', critical: 5, high: 10, medium: 4, low: 0 },
  { ward: 'Mankhurd', critical: 3, high: 8, medium: 3, low: 0 },
  { ward: 'Bandra', critical: 10, high: 14, medium: 7, low: 0 },
]

const RADAR_DATA = [
  { skill: 'Medical', A: 85, B: 65, fullMark: 100 },
  { skill: 'Food', A: 78, B: 82, fullMark: 100 },
  { skill: 'Shelter', A: 92, B: 71, fullMark: 100 },
  { skill: 'Education', A: 68, B: 74, fullMark: 100 },
  { skill: 'Legal', A: 45, B: 58, fullMark: 100 },
  { skill: 'Logistics', A: 88, B: 91, fullMark: 100 },
]

const HEATMAP_DATA = Array.from({ length: 7 }, (_, day) => 
  Array.from({ length: 24 }, (_, hour) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day],
    hour,
    value: Math.floor(Math.random() * 20) + (hour >= 8 && hour <= 20 ? 10 : 0),
    intensity: Math.random()
  }))
).flat()

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
  const stats = {
    open: ANALYTICS_METRICS.openNeeds,
    volunteers: ANALYTICS_METRICS.activeVolunteers,
    today: ANALYTICS_METRICS.todayDispatches,
    rate: Math.min(ANALYTICS_METRICS.dispatchRate, 100),
  }

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#FFFFFF', fontWeight: 500 }}>Analytics</h1>
          <p style={{ fontSize: '14px', color: '#D9D9D9', marginTop: '4px' }}>Comprehensive operational insights and performance metrics.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {[
            { label: 'TOTAL NEEDS', value: stats.open, border: '#FF9E00' },
            { label: 'ACTIVE VOLUNTEERS', value: stats.volunteers, border: '#C77DFF' },
            { label: 'TODAY DISPATCHES', value: stats.today, border: '#6EE7B7' },
            { label: 'DISPATCH SUCCESS', value: `${stats.rate}%`, border: '#D9D9D9' },
          ].map((card) => (
            <div key={card.label} style={{ ...glassCard, padding: '16px', borderLeft: `3px solid ${card.border}` }}>
              <div style={{ fontSize: '32px', color: '#FFFFFF', fontWeight: 500 }}>{card.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(217,217,217,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '8px' }}>{card.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '18px' }}>
          <div style={{ ...glassCard, padding: '16px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 500, marginBottom: '12px' }}>7-Day Need Trend</h3>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_TREND} margin={{ top: 10, right: 12, left: 4, bottom: 4 }}>
                  <CartesianGrid stroke="rgba(217,217,217,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: '#D9D9D9', fontSize: 12 }} axisLine={{ stroke: 'rgba(217,217,217,0.18)' }} />
                  <YAxis tick={{ fill: '#D9D9D9', fontSize: 12 }} axisLine={{ stroke: 'rgba(217,217,217,0.18)' }} />
                  <Tooltip content={<TrendTooltip />} />
                  {CHART_LINES.map((line) => (
                    <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2.2} dot={{ r: 2.5 }} name={line.label} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...glassCard, padding: '16px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 500, marginBottom: '12px' }}>Needs by Category</h3>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
                {PIE_DATA.map((item) => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: '11px', color: '#D9D9D9' }}>{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          <div style={{ ...glassCard, padding: '16px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 500, marginBottom: '12px' }}>Urgency by Ward</h3>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BAR_DATA} margin={{ top: 10, right: 12, left: 4, bottom: 4 }}>
                  <CartesianGrid stroke="rgba(217,217,217,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="ward" tick={{ fill: '#D9D9D9', fontSize: 12 }} axisLine={{ stroke: 'rgba(217,217,217,0.18)' }} />
                  <YAxis tick={{ fill: '#D9D9D9', fontSize: 12 }} axisLine={{ stroke: 'rgba(217,217,217,0.18)' }} />
                  <Tooltip />
                  <Bar dataKey="critical" stackId="a" fill="#FF9E00" />
                  <Bar dataKey="high" stackId="a" fill="#E05A00" />
                  <Bar dataKey="medium" stackId="a" fill="#C77DFF" />
                  <Bar dataKey="low" stackId="a" fill="rgba(217,217,217,0.6)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...glassCard, padding: '16px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 500, marginBottom: '12px' }}>Volunteer Skill Coverage</h3>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 12, left: 4, bottom: 4 }}>
                  <PolarGrid stroke="rgba(217,217,217,0.08)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#D9D9D9', fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#D9D9D9', fontSize: 10 }} />
                  <Radar name="Current" dataKey="A" stroke="#FF9E00" fill="#FF9E00" fillOpacity={0.6} />
                  <Radar name="Target" dataKey="B" stroke="#C77DFF" fill="#C77DFF" fillOpacity={0.4} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ ...glassCard, padding: '16px' }}>
          <h3 style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 500, marginBottom: '12px' }}>Weekly Activity Heatmap</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-end', paddingRight: '8px' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} style={{ fontSize: '11px', color: '#D9D9D9' }}>{day}</span>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: '2px' }}>
              {Array.from({ length: 7 }, (_, day) => 
                Array.from({ length: 24 }, (_, hour) => {
                  const data = HEATMAP_DATA.find(d => d.day === ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day] && d.hour === hour)
                  const intensity = data?.value || 0
                  const opacity = Math.min(intensity / 30, 1)
                  return (
                    <div
                      key={`${day}-${hour}`}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: `rgba(255, 158, 0, ${opacity})`,
                        borderRadius: '2px',
                        position: 'relative'
                      }}
                      title={`${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day]} ${hour}:00 - ${intensity} needs`}
                    />
                  )
                })
              )}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingLeft: '80px' }}>
            <span style={{ fontSize: '11px', color: '#D9D9D9' }}>Hour of day</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#D9D9D9' }}>Low</span>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[0.2, 0.4, 0.6, 0.8, 1].map(opacity => (
                  <div key={opacity} style={{ width: '12px', height: '12px', background: `rgba(255, 158, 0, ${opacity})`, borderRadius: '2px' }} />
                ))}
              </div>
              <span style={{ fontSize: '11px', color: '#D9D9D9' }}>High</span>
            </div>
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
